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

  version_controller::download_version(url, target, asset_name, version).await
}
