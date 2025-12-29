use crate::controllers::settings_controller;

#[tauri::command]
pub fn load_settings() -> Result<settings_controller::Settings, String> {
  settings_controller::STATE.lock().unwrap().read_config()
}

#[tauri::command]
pub fn update_settings(settings: settings_controller::Settings) {
  let _s = settings_controller::STATE.lock().unwrap().write_config(&settings);
}
