use tauri::Manager;

use crate::controllers::{
  app_controller,
  settings_controller::SettingsController,
  version_controller::VersionController,
};

mod controllers;
mod handler;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(
      tauri::generate_handler![
        handler::version_handler::list_versions,
        handler::version_handler::download_version,
        handler::version_handler::remove_version,
        handler::version_handler::start_editor,
        handler::version_handler::start_console,
        handler::settings_handler::load_settings,
        handler::settings_handler::update_settings
      ]
    )
    .setup(move |app| {
      let mut custom_app = app_controller::STATE.lock().unwrap();

      let home_path = app.path().home_dir().unwrap();
      let cache_path = app.path().app_cache_dir().unwrap();

      custom_app.update_data_path(&home_path);
      custom_app.update_cache_path(&cache_path);

      custom_app.settings = Some(SettingsController::new(&custom_app));
      custom_app.versions = Some(VersionController::new(&custom_app));

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
