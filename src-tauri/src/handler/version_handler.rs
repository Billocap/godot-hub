use std::{ collections::HashMap, process::Command };

use tauri::{ AppHandle, Emitter, Manager };
use tauri_plugin_notification::NotificationExt;

use crate::controllers::{ app_controller, version_controller };

#[tauri::command]
pub fn list_versions() -> Result<
  HashMap<String, version_controller::VersionData>,
  String
> {
  let mut custom_app = app_controller::STATE.lock().map_err(|e| e.to_string())?;

  let path = custom_app.settings
    .as_ref()
    .unwrap()
    .settings.versions_folder.clone();

  custom_app.versions.as_mut().unwrap().import_versions(&path)
}

#[tauri::command]
pub async fn download_version(
  app: AppHandle,
  id: usize,
  url: String,
  asset_name: String,
  version: String,
  at_path: String
) -> Result<HashMap<String, version_controller::VersionData>, String> {
  let notify = |m: &str| {
    let _r = app.emit("file_updated", (id, m.to_owned()));
  };
  let cache = app_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .cache_folder.clone();

  notify("Downloading ZIP ...");

  version_controller::download_version(&url, &cache, &asset_name).await?;

  let mut custom_app = app_controller::STATE.lock().map_err(|e| e.to_string())?;

  let controller = custom_app.versions.as_mut().unwrap();

  let result = controller.install_version(
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
      .map_err(|e| e.to_string())?
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
  id: String
) -> Result<version_controller::VersionData, String> {
  let mut custom_app = app_controller::STATE.lock().map_err(|e| e.to_string())?;

  let removed = custom_app.versions.as_mut().unwrap().remove_version(id)?;

  if
    app
      .get_webview_window("main")
      .unwrap()
      .is_minimized()
      .map_err(|e| e.to_string())?
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
pub fn start_editor(id: String) -> Result<String, String> {
  let editor = app_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .versions.as_ref()
    .unwrap()
    .versions.get(&id)
    .unwrap()
    .editor_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}

#[tauri::command]
pub fn start_console(id: String) -> Result<String, String> {
  let editor = app_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .versions.as_ref()
    .unwrap()
    .versions.get(&id)
    .unwrap()
    .console_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}
