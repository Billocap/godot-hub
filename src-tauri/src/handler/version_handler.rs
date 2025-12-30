use std::process::Command;

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

  controller.install_version(url, asset_name, version).await
}

#[tauri::command]
pub fn remove_version(
  id: usize
) -> Result<Vec<version_controller::VersionData>, String> {
  version_controller::STATE
    .lock()
    .map_err(|e| e.to_string())?
    .remove_version(id)
}

#[tauri::command]
pub fn get_editor(id: usize) -> Result<String, String> {
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
