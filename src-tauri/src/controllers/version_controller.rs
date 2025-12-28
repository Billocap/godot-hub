use std::fs;

use regex::Regex;
use tauri::webview::cookie::time::{ format_description, OffsetDateTime };

#[derive(serde::Serialize, serde::Deserialize)]
pub struct FolderData {
  name: String,
  created_at: String,
}

pub fn list_versions(folder: String) -> Vec<FolderData> {
  let paths = std::fs::read_dir(folder).unwrap();
  let mut result: Vec<FolderData> = vec![];
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

        let data = FolderData {
          name: folder_name,
          created_at: created_at.format(&date_format).unwrap(),
        };

        result.push(data);
      }
    }
  }

  result
}

pub async fn download_version(
  url: String,
  target: String
) -> Result<(), String> {
  let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
  let bytes = response.bytes().await.map_err(|e| e.to_string())?;

  fs::write(target, bytes).map_err(|e| e.to_string())
}
