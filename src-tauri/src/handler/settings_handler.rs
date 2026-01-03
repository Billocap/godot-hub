use tauri::Manager;

use crate::controllers::{ settings_controller, version_controller };

#[tauri::command]
pub fn load_settings(
  app: tauri::AppHandle
) -> Result<settings_controller::Settings, String> {
  match version_controller::STATE.lock().unwrap().load_installed() {
    Ok(_) => {}
    Err(_) => {}
  }

  let mut default_path = app
    .path()
    .home_dir()
    .map_err(|e| e.to_string())?;

  default_path.push("Godot");

  settings_controller::STATE.lock().unwrap().read_config(default_path)
}

#[tauri::command]
pub fn update_settings(settings: settings_controller::Settings) {
  let _ = settings_controller::STATE.lock().unwrap().write_config(&settings);
}
