use regex::Regex;
use tauri::webview::cookie::time::{ OffsetDateTime, format_description };

#[derive(serde::Serialize)]
pub struct ResponseData {
  name: String,
  created_at: String,
}

#[tauri::command]
pub fn list_versions(folder: String) -> Vec<ResponseData> {
  let paths = std::fs::read_dir(folder).unwrap();
  let mut result: Vec<ResponseData> = vec![];
  let version_regex = Regex::new(r"^v?\d+\.\d+\.\d+-.*").unwrap();
  let date_format = format_description
    ::parse("[year]-[month]-[day] [hour]:[minute]:[second]")
    .unwrap();

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

        let data = ResponseData {
          name: folder_name,
          created_at: created_at.format(&date_format).unwrap(),
        };

        result.push(data);
      }
    }
  }

  result
}
