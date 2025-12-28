mod handler;
mod configs;
mod events;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(
      tauri::generate_handler![
        handler::version_handler::list_versions,
        handler::settings_handler::load_settings,
        handler::settings_handler::update_settings
      ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
