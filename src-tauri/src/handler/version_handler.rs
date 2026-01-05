use std::{ collections::HashMap, path::PathBuf, process::Command, sync::Mutex };

use tauri::{ AppHandle, Emitter, Manager, State };
use tauri_plugin_notification::NotificationExt;

use crate::controllers::{ app_controller::AppController, version_controller };

#[tauri::command]
pub fn list_versions(
  state: State<'_, Mutex<AppController>>
) -> Result<HashMap<String, version_controller::VersionData>, String> {
  let mut custom_app = state.lock().map_err(|e| e.to_string())?;

  let path = custom_app.settings.settings.versions_folder.clone();

  custom_app.versions.import_versions(&path)
}

#[tauri::command]
pub async fn download_version(
  app: AppHandle,
  state: State<'_, Mutex<AppController>>,
  id: usize,
  url: String,
  asset_name: String,
  version: String,
  at_path: String
) -> Result<HashMap<String, version_controller::VersionData>, String> {
  let notify = |m: &str| {
    let _r = app.emit("file_updated", (id, m.to_owned()));
  };
  let cache = state
    .lock()
    .map_err(|e| e.to_string())?
    .cache_folder.clone();

  notify("Downloading ZIP ...");

  version_controller::download_version(&url, &cache, &asset_name).await?;

  let mut custom_app = state.lock().map_err(|e| e.to_string())?;

  let result = custom_app.versions.install_version(
    &cache,
    asset_name,
    &version,
    &at_path,
    notify
  )?;

  if
    app
      .get_webview_window("main")
      .unwrap()
      .is_minimized()
      .map_or(false, |b| b)
  {
    app
      .notification()
      .builder()
      .title("New Version Installed!")
      .body(format!("'{}' was installed successfully.", version))
      .show()
      .map_err(|e| e.to_string())?;
  }

  Ok(result)
}

#[tauri::command]
pub fn remove_version(
  app: AppHandle,
  state: State<'_, Mutex<AppController>>,
  id: String
) -> Result<version_controller::VersionData, String> {
  let mut custom_app = state.lock().map_err(|e| e.to_string())?;

  let removed = custom_app.versions.remove_version(id)?;

  if
    app
      .get_webview_window("main")
      .unwrap()
      .is_minimized()
      .map_or(false, |b| b)
  {
    app
      .notification()
      .builder()
      .title("Godot Version Removed!")
      .body(format!("'{}' was removed successfully.", removed.name))
      .show()
      .map_err(|e| e.to_string())?;
  }

  Ok(removed)
}

#[tauri::command]
pub fn start_editor(
  state: State<'_, Mutex<AppController>>,
  id: String
) -> Result<PathBuf, String> {
  let editor = state
    .lock()
    .map_err(|e| e.to_string())?
    .versions.versions.get(&id)
    .unwrap()
    .editor_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}

#[tauri::command]
pub fn start_console(
  state: State<'_, Mutex<AppController>>,
  id: String
) -> Result<PathBuf, String> {
  let editor = state
    .lock()
    .map_err(|e| e.to_string())?
    .versions.versions.get(&id)
    .unwrap()
    .console_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}
