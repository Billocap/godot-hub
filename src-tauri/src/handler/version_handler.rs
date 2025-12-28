use crate::controllers::{ version_controller };

#[tauri::command]
pub fn list_versions(folder: String) -> Vec<version_controller::FolderData> {
  version_controller::list_versions(folder)
}

#[tauri::command]
pub async fn download_version(
  url: String,
  target: String,
  asset_name: String,
  version: String
) -> Result<(), String> {
  version_controller::download_version(url, target, asset_name, version).await
}
