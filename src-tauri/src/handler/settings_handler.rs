use tauri::Manager;

use crate::controllers::{ app_controller, settings_controller };

#[tauri::command]
pub fn load_settings(
  app: tauri::AppHandle
) -> Result<settings_controller::Settings, String> {
  let mut custom_app = app_controller::STATE.lock().map_err(|e| e.to_string())?;

  match custom_app.versions.as_mut().unwrap().load_installed() {
    Ok(_) => {}
    Err(_) => {}
  }

  let mut default_path = app
    .path()
    .home_dir()
    .map_err(|e| e.to_string())?;

  default_path.push("Godot");

  let settings = custom_app.settings.as_mut().unwrap();

  settings.read_config(default_path)
}

#[tauri::command]
pub fn update_settings(settings: settings_controller::Settings) {
  let mut custom_app = app_controller::STATE.lock().unwrap();

  let _ = custom_app.settings.as_mut().unwrap().write_config(&settings);
}
