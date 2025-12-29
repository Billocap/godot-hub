use std::process::Command;

use crate::controllers::{ settings_controller, version_controller };

#[tauri::command]
pub fn list_versions(folder: String) -> Vec<version_controller::FolderData> {
  version_controller::list_versions(folder)
}

#[tauri::command]
pub async fn download_version(
  url: String,
  asset_name: String,
  version: String
) -> Result<(), String> {
  let target = {
    let guard = settings_controller::STATE.lock().unwrap();

    guard.settings.versions_folder.clone()
  };

  version_controller::install_version(url, target, asset_name, version).await
}

#[tauri::command]
pub fn remove_version(path: String) -> Result<(), String> {
  version_controller::remove_version(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_editor(path: String) -> Result<String, String> {
  let editor = version_controller::get_editor(path)?;

  let _c = Command::new(editor.clone())
    .spawn()
    .map_err(|e| e.to_string())?;

  Ok(editor)
}
