use std::process::Command;

use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

use crate::controllers::version_controller;

#[tauri::command]
pub fn list_versions() -> Result<Vec<version_controller::VersionData>, String> {
  version_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .list_versions()
}

#[tauri::command]
pub async fn download_version(
  app: AppHandle,
  url: String,
  asset_name: String,
  version: String
) -> Result<(), String> {
  let controller = {
    version_controller::STATE
      .lock()
      .map_err(|e| e.to_string())?
      .clone()
  };

  controller.install_version(url, asset_name, version.clone()).await?;

  app
    .notification()
    .builder()
    .title("New Version Installed!")
    .body(format!("'{}' was installed successfully.", version))
    .show()
    .map_err(|e| e.to_string())?;

  Ok(())
}

#[tauri::command]
pub fn remove_version(
  app: AppHandle,
  id: usize
) -> Result<version_controller::VersionData, String> {
  let removed = version_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .remove_version(id)?;

  app
    .notification()
    .builder()
    .title("Godot Version Removed!")
    .body(format!("'{}' was removed successfully.", removed.name))
    .show()
    .map_err(|e| e.to_string())?;

  Ok(removed)
}

#[tauri::command]
pub fn start_editor(id: usize) -> Result<String, String> {
  let editor = version_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .versions.get(id)
    .unwrap()
    .editor_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}

#[tauri::command]
pub fn start_console(id: usize) -> Result<String, String> {
  let editor = version_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .versions.get(id)
    .unwrap()
    .console_path.clone();

  let _c = Command::new(&editor)
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}
