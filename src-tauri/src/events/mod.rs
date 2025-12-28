use tauri::Emitter;

use crate::configs::hub_configs;

#[tauri::command]
pub fn configs_loaded(app: tauri::AppHandle) {
  app.emit("configs-loaded", hub_configs::read_config()).unwrap();
}
