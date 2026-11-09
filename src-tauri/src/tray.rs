use std::sync::Mutex;
use tauri::image::Image;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::Manager;

use crate::i18n::texts;

pub const TRAY_ID: &str = "main-tray";
const MENU_SHOW: &str = "show";
const MENU_QUIT: &str = "quit";
// Glifo negro sobre transparente: macOS lo tiñe según el tema de la barra.
const TRAY_ICON: &[u8] = include_bytes!("../icons/tray.png");
const BYTES_PER_GB: f64 = 1024.0 * 1024.0 * 1024.0;

/// Último total liberable medido; sobrevive a quitar y volver a poner la bandeja.
static LAST_RECLAIMABLE: Mutex<Option<u64>> = Mutex::new(None);

/// "12.3 GB" (misma base 1024 que disk-clean y la ventana).
fn format_gb(bytes: u64) -> String {
    format!("{:.1} GB", bytes as f64 / BYTES_PER_GB)
}

fn build_menu(app: &tauri::AppHandle, reclaimable: Option<u64>) -> tauri::Result<Menu<tauri::Wry>> {
    let menu = Menu::new(app)?;
    let header = match reclaimable {
        Some(bytes) => format!("{} {}", format_gb(bytes), texts().reclaimable),
        None => texts().not_scanned.to_string(),
    };
    menu.append(&MenuItem::new(app, header, false, None::<&str>)?)?;
    menu.append(&PredefinedMenuItem::separator(app)?)?;
    menu.append(&MenuItem::with_id(
        app,
        MENU_SHOW,
        texts().show,
        true,
        None::<&str>,
    )?)?;
    menu.append(&MenuItem::with_id(
        app,
        MENU_QUIT,
        texts().quit,
        true,
        None::<&str>,
    )?)?;
    Ok(menu)
}

/// Título junto al icono: los GB liberables de un vistazo.
fn title(reclaimable: Option<u64>) -> Option<String> {
    reclaimable.map(format_gb)
}

pub fn show_main_window(app: &tauri::AppHandle) {
    // Como accesorio (sin Dock) la app no se activa sola al mostrar la ventana.
    #[cfg(target_os = "macos")]
    let _ = app.show();
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

/// Atajo global: alterna la ventana. Es la vía de entrada cuando el icono de
/// la bandeja queda tapado (pantallas pequeñas, notch, muchos iconos).
pub fn toggle_main_window(app: &tauri::AppHandle) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };
    let visible = window.is_visible().unwrap_or(false);
    let focused = window.is_focused().unwrap_or(false);
    if visible && focused {
        let _ = window.hide();
    } else {
        show_main_window(app);
    }
}

fn on_menu_event(app: &tauri::AppHandle, id: &str) {
    match id {
        MENU_QUIT => app.exit(0),
        MENU_SHOW => show_main_window(app),
        _ => {}
    }
}

/// Lo llama cada análisis: guarda el total y, si hay bandeja, la actualiza.
pub fn set_reclaimable(app: &tauri::AppHandle, bytes: u64) {
    if let Ok(mut last) = LAST_RECLAIMABLE.lock() {
        *last = Some(bytes);
    }
    let handle = app.clone();
    let _ = app.run_on_main_thread(move || {
        let Some(tray) = handle.tray_by_id(TRAY_ID) else {
            return;
        };
        let _ = tray.set_title(title(Some(bytes)).as_deref());
        if let Ok(menu) = build_menu(&handle, Some(bytes)) {
            let _ = tray.set_menu(Some(menu));
        }
    });
}

#[cfg(target_os = "macos")]
fn set_dock_visible(app: &tauri::AppHandle, visible: bool) {
    let policy = if visible {
        tauri::ActivationPolicy::Regular
    } else {
        tauri::ActivationPolicy::Accessory
    };
    let _ = app.set_activation_policy(policy);
}

#[cfg(not(target_os = "macos"))]
fn set_dock_visible(_app: &tauri::AppHandle, _visible: bool) {}

pub fn create(app: &tauri::AppHandle) -> tauri::Result<()> {
    if app.tray_by_id(TRAY_ID).is_some() {
        return Ok(());
    }
    let reclaimable = LAST_RECLAIMABLE.lock().ok().and_then(|last| *last);
    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .icon(Image::from_bytes(TRAY_ICON)?)
        .icon_as_template(true)
        .menu(&build_menu(app, reclaimable)?)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| on_menu_event(app, event.id.as_ref()));
    if let Some(text) = title(reclaimable) {
        builder = builder.title(text);
    }
    builder.build(app)?;
    // Con bandeja la app es un accesorio de la barra de menús: sin icono en el Dock.
    set_dock_visible(app, false);
    Ok(())
}

pub fn remove(app: &tauri::AppHandle) {
    let _ = app.remove_tray_by_id(TRAY_ID);
    set_dock_visible(app, true);
}
