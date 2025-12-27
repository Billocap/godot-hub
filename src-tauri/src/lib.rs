use regex::Regex;
use tauri::webview::cookie::time::{ OffsetDateTime, format_description };

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(serde::Serialize)]
pub struct ResponseData {
  name: String,
  created_at: String,
}

#[tauri::command]
fn list_versions(folder: String) -> Vec<ResponseData> {
  let paths = std::fs::read_dir(folder).unwrap();
  let mut result: Vec<ResponseData> = vec![];
  let version_regex = Regex::new(r"^v?\d+\.\d+\.\d+-.*").unwrap();

  for path in paths {
    let entry = path.unwrap().path();

    if entry.is_dir() {
      let folder_name = entry.file_name().unwrap().to_str().unwrap().to_owned();

      if version_regex.is_match(&folder_name) {
        let created_at: OffsetDateTime = entry
          .metadata()
          .unwrap()
          .created()
          .unwrap()
          .into();
        let format = format_description
          ::parse("[year]-[month]-[day] [hour]:[minute]:[second]")
          .unwrap();

        let data = ResponseData {
          name: folder_name,
          created_at: created_at.format(&format).unwrap(),
        };

        result.push(data);
      }
    }
  }

  result
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![greet, list_versions])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
