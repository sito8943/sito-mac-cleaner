# Sito Mac Cleaner

App de barra de menús (Tauri 2 + React + `@sito/ui`) para limpiar el disco de
macOS. Por debajo ejecuta [`disk-clean`](cli/disk-clean), un script de bash que
también se puede usar solo desde la terminal.

- **Analiza sin borrar:** al abrirse ejecuta `disk-clean --list` (lo mismo que
  `--dry-run`) y muestra cada elemento limpiable con su tamaño y una casilla.
  Por defecto marca todo lo que se puede limpiar.
- **Medidor de LEDs** alrededor del botón: suma lo marcado. Verde por debajo de
  10 GB, amarillo de 10 a 30 GB y rojo desde 30 GB.
- **Botón del fin del mundo:** el primer clic levanta la tapa de seguridad y el
  segundo limpia. Si no lo pulsas en 5 s, la tapa se vuelve a cerrar. Mientras
  analiza o limpia, el botón está bloqueado.
- **Salida en directo:** durante la limpieza ves lo que imprime el script. Al
  terminar vuelve a analizar y te dice cuánto liberaste.
- **Barra de menús:** el primer arranque pide permiso para instalarse ahí. Junto
  al icono se ven los GB liberables. **⌃⌥C** muestra u oculta la ventana desde
  cualquier app.

Idiomas: español e inglés, según el idioma preferido de macOS (si no es ninguno
de los dos, inglés).

## Qué limpia

| Sección               | Qué hace                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Cachés de apps        | Borra cachés de navegadores, Spotify, Steam, Playwright, Gradle, VS Code y `~/.cache` (menos corepack).  |
| Gestores de paquetes  | `pnpm store prune` (uno por cada versión de store), `npm`/`yarn`/`composer` cache, `brew cleanup`.       |
| node_modules          | Cada `node_modules` bajo `~/Documents`, una fila por proyecto. `pnpm install` los recupera.              |
| Builds de Tauri/Rust  | Cada `target/` junto a un `Cargo.toml` (todos los `src-tauri/target`). `cargo build` los recupera.       |
| Docker                | Imágenes sin usar, caché de build y volúmenes anónimos. Los volúmenes con nombre se conservan.           |
| VS Code               | Versiones viejas de extensiones; conserva la más nueva.                                                  |
| Backups del VPS       | `~/Backups/sito-vps/<proyecto>`: conserva los 7 días más recientes según la fecha del nombre de archivo. |
| Sesiones Claude/Codex | Sesiones de Claude Code y Codex sin tocar en 14 días. La memoria de Claude nunca se toca.                |
| Papelera              | Vacía `~/.Trash` con Finder (la primera vez macOS pide permiso para controlarlo).                        |
| Apps de chat          | Solo informa del tamaño de WhatsApp y Telegram; eso se limpia desde cada app.                            |

Nunca toca `~/Virtual Machines.localized`. Una sección que no aplica a tu Mac
(sin Docker, sin backups…) simplemente no aparece.

> **Ojo:** la limpieza borra de verdad. Revisa lo marcado antes de pulsar el
> botón. Algunas rutas (backups del VPS, sesiones de Claude Code y Codex) son
> del flujo de trabajo del autor; desmárcalas si no quieres que se borren.

## CLI

```sh
cli/disk-clean --dry-run            # qué borraría y cuánto ocupa
cli/disk-clean                      # limpia todo
cli/disk-clean --list               # plan en TSV (lo que usa la app)
cli/disk-clean --only npm-cache,docker-images
cli/disk-clean --keep-days 14 --session-days 30
cli/disk-clean --projects ~/Code       # dónde buscar node_modules y target/
```

Para tenerlo en el PATH, enlázalo en lugar de copiarlo; así la app y la
terminal usan siempre el mismo script:

```sh
ln -sf "$PWD/cli/disk-clean" ~/bin/disk-clean
```

El script debe seguir siendo compatible con bash 3.2: la app lo ejecuta con
`/bin/bash` y con el PATH mínimo de macOS, al que el propio script añade
Homebrew, nvm, pnpm, Herd y Docker.

## Desarrollo

```sh
pnpm install
pnpm tauri dev
```

Para volver a ver la pantalla de permiso: "Quitar de la barra de menús" en la
ventana, o borrar
`~/Library/Application Support/com.sito8943.mac-cleaner/settings.json`.

## Instalar (Homebrew)

```sh
brew install --cask sito8943/tap/sito-mac-cleaner
xattr -dr com.apple.quarantine "/Applications/Sito Mac Cleaner.app"
```

La app no está firmada: el segundo comando evita que macOS bloquee el primer
arranque.

## Publicar una versión

1. Sube la versión en `package.json`, `src-tauri/Cargo.toml` y
   `src-tauri/tauri.conf.json`.
2. Publica un Release `vX.Y.Z` en GitHub. Los workflows construyen los `.dmg`
   (Intel y Apple Silicon), los adjuntan y actualizan el cask en
   `sito8943/homebrew-tap`.

Requisito único: secreto `TAP_GITHUB_TOKEN` en el repo (PAT con Contents:write
sobre `sito8943/homebrew-tap`).

## Licencia

MIT, ver [LICENSE](LICENSE).
