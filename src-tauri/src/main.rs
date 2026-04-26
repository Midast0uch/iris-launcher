#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::process::Command;

/// Spawn the IRIS Widget exe and signal the caller to close the launcher.
///
/// Search order:
///   1. $IRIS_WIDGET_PATH                                (override)
///   2. C:\Program Files\IRIS Widget\iris-widget.exe     (MSI default)
///   3. C:\temp\tauri-build\release\iris-widget.exe      (dev build)
///   4. <launcher_exe_dir>\..\IRIS Widget\iris-widget.exe (sibling install)
///
/// Returns the path that was launched on success.
#[tauri::command]
fn launch_iris_widget() -> Result<String, String> {
    let mut candidates: Vec<String> = Vec::new();

    if let Ok(p) = std::env::var("IRIS_WIDGET_PATH") {
        candidates.push(p);
    }
    candidates.push(r"C:\Program Files\IRIS Widget\iris-widget.exe".to_string());
    candidates.push(r"C:\temp\tauri-build\release\iris-widget.exe".to_string());

    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            candidates.push(
                dir.join("..")
                    .join("IRIS Widget")
                    .join("iris-widget.exe")
                    .to_string_lossy()
                    .into_owned(),
            );
        }
    }

    for path in &candidates {
        if Path::new(path).exists() {
            Command::new(path)
                .spawn()
                .map_err(|e| format!("spawn failed: {} ({})", e, path))?;
            return Ok(path.clone());
        }
    }

    Err(format!(
        "iris-widget.exe not found in any of: {}",
        candidates.join("; ")
    ))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![launch_iris_widget])
        .build(tauri::generate_context!())
        .expect("error while building IRIS Launcher")
        .run(|_app, event| {
            if let tauri::RunEvent::ExitRequested { .. } = event {}
        });
}
