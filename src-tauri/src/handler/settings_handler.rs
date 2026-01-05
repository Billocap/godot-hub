use std::sync::Mutex;

use tauri::{ Manager, State };

use crate::controllers::{ app_controller::AppController, settings_controller };

#[tauri::command]
pub fn load_settings(
  app: tauri::AppHandle,
  state: State<'_, Mutex<AppController>>
) -> Result<settings_controller::Settings, String> {
  let mut custom_app = state.lock().map_err(|e| e.to_string())?;

  let _ = custom_app.versions.load_installed().map_or((), |_| ());

  let mut default_path = app
    .path()
    .home_dir()
    .map_err(|e| e.to_string())?;

  default_path.push("Godot");

  custom_app.settings.read_config(default_path)
}

#[tauri::command]
pub fn update_settings(
  state: State<'_, Mutex<AppController>>,
  settings: settings_controller::Settings
) {
  let mut custom_app = state.lock().unwrap();

  let _ = custom_app.settings.write_config(&settings);
}
