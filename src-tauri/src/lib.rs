use tauri::Manager;

use crate::controllers::settings_controller;

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
      let mut controller = settings_controller::STATE.lock().unwrap();

      controller.update_config_path(&app.path().home_dir().unwrap());
      controller.update_cache_path(&app.path().app_cache_dir().unwrap());

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
