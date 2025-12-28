use tauri::Manager;

use crate::controllers::settings_controller;

#[tauri::command]
pub fn load_settings(
  app: tauri::AppHandle
) -> Result<settings_controller::ConfigData, String> {
  let home_path = app.path().home_dir().unwrap();

  settings_controller::read_config(&home_path)
}

#[tauri::command]
pub fn update_settings(
  app: tauri::AppHandle,
  settings: settings_controller::ConfigData
) {
  let home_path = app.path().home_dir().unwrap();

  settings_controller::write_config(&home_path, &settings).unwrap();
}
