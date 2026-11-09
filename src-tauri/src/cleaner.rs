use serde::Serialize;
use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::path::BaseDirectory;
use tauri::{Emitter, Manager};

/// Nombre del script dentro de los recursos de la app (bundle.resources en tauri.conf.json).
const SCRIPT_RESOURCE: &str = "disk-clean";
/// Bash del sistema (3.2): siempre existe y el script se mantiene compatible con él.
const BASH: &str = "/bin/bash";
/// Evento con cada línea que imprime disk-clean mientras limpia.
/// Debe coincidir con CLEANER_EVENT.LOG en src/shared/services/constants.ts.
pub const LOG_EVENT: &str = "cleaner://log";

// Códigos de error que traduce el frontend (src/features/cleaner/constants.ts).
const ERR_SCRIPT_NOT_FOUND: &str = "script-not-found";
const ERR_SCRIPT_FAILED: &str = "script-failed";
const ERR_INVALID_ITEM: &str = "invalid-item";
const ERR_BUSY: &str = "busy";

/// Un análisis y una limpieza a la vez: borrar mientras se mide daría tamaños falsos.
static BUSY: AtomicBool = AtomicBool::new(false);

struct BusyGuard;

impl BusyGuard {
    fn acquire() -> Result<Self, String> {
        BUSY.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .map(|_| BusyGuard)
            .map_err(|_| ERR_BUSY.to_string())
    }
}

impl Drop for BusyGuard {
    fn drop(&mut self) {
        BUSY.store(false, Ordering::Release);
    }
}

/// Espejo de `CleanItem` en src/shared/models/cleanItem.ts.
#[derive(Serialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CleanItem {
    pub id: String,
    pub section: String,
    /// "rm" | "cmd" | "info" (info = solo se muestra, nunca se limpia).
    pub kind: String,
    /// `None` cuando el script no puede estimar lo que libera (p. ej. `pnpm store prune`).
    pub bytes: Option<u64>,
    pub label: String,
}

#[derive(Serialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ScanResult {
    pub free_bytes: u64,
    pub items: Vec<CleanItem>,
}

/// En la app empaquetada el script va en Resources; en `tauri dev` también se copia
/// a target/, así que la misma ruta sirve en ambos casos.
fn script_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .resolve(SCRIPT_RESOURCE, BaseDirectory::Resource)
        .ok()
        .filter(|path| path.is_file())
        .ok_or_else(|| ERR_SCRIPT_NOT_FOUND.to_string())
}

/// Salida de `disk-clean --list`: "free\t<bytes>" y una línea "item\t…" por elemento.
fn parse_list(stdout: &str) -> ScanResult {
    let mut result = ScanResult {
        free_bytes: 0,
        items: Vec::new(),
    };
    for line in stdout.lines() {
        let fields: Vec<&str> = line.split('\t').collect();
        match fields.as_slice() {
            ["free", bytes] => result.free_bytes = bytes.parse().unwrap_or(0),
            ["item", id, section, kind, bytes, label] => result.items.push(CleanItem {
                id: id.to_string(),
                section: section.to_string(),
                kind: kind.to_string(),
                // -1 = tamaño desconocido
                bytes: bytes.parse::<i64>().ok().and_then(|b| u64::try_from(b).ok()),
                label: label.to_string(),
            }),
            _ => {}
        }
    }
    result
}

/// Los ids viajan a la línea de comandos separados por comas: solo caracteres
/// que el script genera (ver `slug` en cli/disk-clean).
fn valid_id(id: &str) -> bool {
    !id.is_empty()
        && id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-'))
}

pub fn scan(app: &tauri::AppHandle) -> Result<ScanResult, String> {
    let _busy = BusyGuard::acquire()?;
    let output = Command::new(BASH)
        .arg(script_path(app)?)
        .arg("--list")
        .stdin(Stdio::null())
        .output()
        .map_err(|e| format!("{ERR_SCRIPT_FAILED}: {e}"))?;
    if !output.status.success() {
        return Err(format!(
            "{ERR_SCRIPT_FAILED}: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    Ok(parse_list(&String::from_utf8_lossy(&output.stdout)))
}

/// Ejecuta `disk-clean --only <ids>` y reenvía cada línea al frontend según sale,
/// para que la limpieza (que puede tardar minutos con docker o brew) no parezca colgada.
pub fn clean(app: &tauri::AppHandle, ids: &[String]) -> Result<(), String> {
    if ids.is_empty() || !ids.iter().all(|id| valid_id(id)) {
        return Err(ERR_INVALID_ITEM.to_string());
    }
    let _busy = BusyGuard::acquire()?;
    let mut child = Command::new(BASH)
        .arg(script_path(app)?)
        .arg("--only")
        .arg(ids.join(","))
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("{ERR_SCRIPT_FAILED}: {e}"))?;
    if let Some(stdout) = child.stdout.take() {
        for line in BufReader::new(stdout).lines().map_while(Result::ok) {
            let _ = app.emit(LOG_EVENT, line);
        }
    }
    let output = child
        .wait_with_output()
        .map_err(|e| format!("{ERR_SCRIPT_FAILED}: {e}"))?;
    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "{ERR_SCRIPT_FAILED}: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_list_output() {
        let out = "free\t1000\nitem\tnpm-cache\tpackages\tcmd\t42\tnpm cache clean --force\n\
                   item\tpnpm-prune\tpackages\tcmd\t-1\tpnpm store prune\nnoise\n";
        let result = parse_list(out);
        assert_eq!(result.free_bytes, 1000);
        assert_eq!(result.items.len(), 2);
        assert_eq!(result.items[0].bytes, Some(42));
        assert_eq!(result.items[1].bytes, None);
        assert_eq!(result.items[1].label, "pnpm store prune");
    }

    #[test]
    fn rejects_ids_that_could_break_the_command_line() {
        assert!(valid_id("Library_Caches_net.imput.helium"));
        assert!(valid_id("backups-sito-chat"));
        assert!(!valid_id(""));
        assert!(!valid_id("a,b"));
        assert!(!valid_id("x; rm -rf ~"));
    }
}
