use std::{ fs::{ self, File }, path::PathBuf, sync::{ LazyLock, Mutex } };

use regex::Regex;
use tauri::webview::cookie::time::{ format_description, OffsetDateTime };
use zip::ZipArchive;

use crate::controllers::settings_controller;

const VERSION_REGEX: &str = r"^v?\d+\.\d+(\.\d+)?-stable";
const EXE_REGEX: &str = r"^[Gg]odot_v?\d+\.\d+(\.\d+)?-stable(_mono)?";
const DATA_FORMAT: &str = "[year]-[month]-[day] [hour]:[minute]:[second]";

pub static STATE: LazyLock<Mutex<VersionController>> = LazyLock::new(|| {
  let controller = VersionController {
    versions: vec![],
  };

  Mutex::new(controller)
});

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct VersionData {
  pub name: String,
  pub path: String,
  pub editor_path: String,
  pub created_at: String,
}

impl VersionData {}

#[derive(Clone)]
pub struct VersionController {
  pub versions: Vec<VersionData>,
}

impl VersionController {
  pub fn list_versions(&mut self) -> Result<Vec<VersionData>, String> {
    let path = settings_controller::STATE
      .lock()
      .unwrap()
      .settings.versions_folder.clone();
    let contents = fs::read_dir(path).map_err(|e| e.to_string())?;
    let mut result: Vec<VersionData> = vec![];
    let version_regex = Regex::new(VERSION_REGEX).map_err(|e| e.to_string())?;
    let date_format = format_description
      ::parse(DATA_FORMAT)
      .map_err(|e| e.to_string())?;

    for content in contents {
      let entry = content.map_err(|e| e.to_string())?.path();

      if entry.is_dir() {
        let folder_name = entry
          .file_name()
          .unwrap()
          .to_str()
          .unwrap()
          .to_owned();

        if version_regex.is_match(&folder_name) {
          let created_at: OffsetDateTime = entry
            .metadata()
            .map_err(|e| e.to_string())?
            .created()
            .map_err(|e| e.to_string())?
            .into();

          let data = VersionData {
            name: folder_name,
            path: entry.as_os_str().to_str().unwrap().to_owned(),
            editor_path: get_editor(entry)?,
            created_at: created_at
              .format(&date_format)
              .map_err(|e| e.to_string())?,
          };

          result.push(data);
        }
      }
    }

    self.versions = result.clone();

    Ok(result)
  }

  pub async fn install_version(
    &self,
    url: String,
    asset_name: String,
    version: String
  ) -> Result<(), String> {
    let target = settings_controller::STATE
      .lock()
      .map_err(|e| e.to_string())?
      .settings.versions_folder.clone();
    let bytes = reqwest
      ::get(url).await
      .map_err(|e| e.to_string())?
      .bytes().await
      .map_err(|e| e.to_string())?;

    let mut target_path = PathBuf::from(&target);

    target_path.push(asset_name);

    fs::write(&target_path, bytes).map_err(|e| e.to_string())?;

    let reader = File::open(&target_path).map_err(|e| e.to_string())?;

    let mut archive = ZipArchive::new(reader).map_err(|e| e.to_string())?;

    let mut result_path = PathBuf::from(&target);

    result_path.push(version);

    archive.extract(result_path).map_err(|e| e.to_string())?;

    fs::remove_file(&target_path).map_err(|e| e.to_string())
  }

  pub fn remove_version(
    &mut self,
    id: usize
  ) -> Result<Vec<VersionData>, String> {
    let removed = self.versions.remove(id);

    fs::remove_dir_all(removed.path).map_err(|e| e.to_string())?;

    Ok(self.versions.clone())
  }
}

fn get_editor(folder: PathBuf) -> Result<String, String> {
  let exe_regex = Regex::new(EXE_REGEX).unwrap();
  let contents = fs::read_dir(folder).map_err(|e| e.to_string())?;

  for content in contents {
    let entry = content.map_err(|e| e.to_string())?.path();
    let path = entry.as_os_str().to_str().unwrap().to_owned();
    let file_name = entry.file_name().unwrap().to_str().unwrap();

    if
      entry.is_file() &&
      exe_regex.is_match(file_name) &&
      !file_name.contains("console")
    {
      return Ok(path);
    }

    if entry.is_dir() {
      match get_editor(entry) {
        Ok(data) => {
          return Ok(data);
        }
        Err(_) => {}
      };
    }
  }

  Err(String::from("Not able to find editor exe!"))
}
