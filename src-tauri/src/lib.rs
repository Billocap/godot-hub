use tauri::Manager;

use crate::controllers::settings_controller;

mod controllers;
mod handler;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(
      tauri::generate_handler![
        handler::version_handler::list_versions,
        handler::version_handler::download_version,
        handler::version_handler::remove_version,
        handler::version_handler::get_editor,
        handler::settings_handler::load_settings,
        handler::settings_handler::update_settings
      ]
    )
    .setup(move |a| {
      settings_controller::STATE
        .lock()
        .unwrap()
        .update_config_path(&a.path().home_dir().unwrap());

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
