use crate::configs::hub_configs;

#[tauri::command]
pub fn load_settings() -> hub_configs::ConfigData {
  hub_configs::read_config().unwrap()
}

#[tauri::command]
pub fn update_settings(settings: hub_configs::ConfigData) {
  hub_configs::write_config(&settings);
}
