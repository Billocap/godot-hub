use std::{ fs::{ self, File }, path::PathBuf, sync::{ LazyLock, Mutex } };

use regex::Regex;
use tauri::{ webview::cookie::time::{ OffsetDateTime, format_description } };
use zip::ZipArchive;

use crate::{ controllers::settings_controller, utils::file_utils };

const VERSION_REGEX: &str = r"^v?\d+\.\d+(\.\d+)?-stable";
const EXE_REGEX: &str = r"^[Gg]odot_v?\d+\.\d+(\.\d+)?-stable(_mono)?";
const DATA_FORMAT: &str = "[year]-[month]-[day] [hour]:[minute]:[second]";

pub static STATE: LazyLock<Mutex<VersionController>> = LazyLock::new(|| {
  let controller = VersionController { versions: vec![] };

  Mutex::new(controller)
});

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct VersionData {
  pub name: String,
  pub path: String,
  pub size: u64,
  pub editor_path: String,
  pub console_path: String,
  pub updated_at: String,
  pub created_at: String,
}

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
          let metadata = entry.metadata().map_err(|e| e.to_string())?;
          let created_at: OffsetDateTime = metadata
            .created()
            .map_err(|e| e.to_string())?
            .into();
          let updated_at: OffsetDateTime = metadata
            .modified()
            .map_err(|e| e.to_string())?
            .into();
          let (editor_path, console_path, size) = get_folder_data(&entry)?;

          let data = VersionData {
            name: folder_name,
            path: entry.as_os_str().to_str().unwrap().to_owned(),
            editor_path: editor_path,
            console_path: console_path,
            size: size,
            updated_at: updated_at
              .format(&date_format)
              .map_err(|e| e.to_string())?,
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
    version: String,
    notify: impl Fn(&str)
  ) -> Result<(), String> {
    let settings = settings_controller::STATE
      .lock()
      .map_err(|e| e.to_string())?
      .clone();

    let target = settings.settings.versions_folder.clone();
    let cache = settings.cache_folder.clone();

    notify("Downloading zip...");

    let bytes = reqwest
      ::get(url).await
      .map_err(|e| e.to_string())?
      .bytes().await
      .map_err(|e| e.to_string())?;

    notify("Creating temp file...");

    let target_path: PathBuf = [&cache, &asset_name.into()].iter().collect();

    fs::write(&target_path, bytes).map_err(|e| e.to_string())?;

    notify("Reading temp file...");

    let reader = File::open(&target_path).map_err(|e| e.to_string())?;

    let mut archive = ZipArchive::new(reader).map_err(|e| e.to_string())?;

    let temp_result_path: PathBuf = [&cache, &version.clone().into()]
      .iter()
      .collect();

    let result_path: PathBuf = [&target, &version.clone().into()]
      .iter()
      .collect();

    notify("Extracting ZIP...");

    archive.extract(&temp_result_path).map_err(|e| e.to_string())?;

    file_utils::copy_folder(&temp_result_path, &result_path)?;

    notify("Cleaning Up...");

    fs::remove_dir_all(&temp_result_path).map_err(|e| e.to_string())?;
    fs::remove_file(&target_path).map_err(|e| e.to_string())
  }

  pub fn remove_version(&mut self, id: usize) -> Result<VersionData, String> {
    let removed = self.versions.remove(id);

    fs::remove_dir_all(removed.path.clone()).map_err(|e| e.to_string())?;

    Ok(removed)
  }
}

fn get_folder_data(folder: &PathBuf) -> Result<(String, String, u64), String> {
  let exe_regex = Regex::new(EXE_REGEX).unwrap();
  let contents = fs::read_dir(folder).map_err(|e| e.to_string())?;

  let mut editor_path = String::new();
  let mut console_path = String::new();
  let mut size: u64 = 0;

  for content in contents {
    let entry = content.map_err(|e| e.to_string())?.path();
    let file_name = entry.file_name().unwrap().to_str().unwrap();
    let file_size = entry
      .metadata()
      .map_err(|e| e.to_string())?
      .len();

    size += file_size;

    if entry.is_file() && exe_regex.is_match(file_name) {
      let path = entry.as_os_str().to_str().unwrap().to_owned();

      if file_name.contains("console") {
        console_path = path;
      } else {
        editor_path = path;
      }
    }

    if entry.is_dir() {
      let (sub_editor, sub_console, sub_size) = get_folder_data(&entry)?;

      editor_path = sub_editor;
      console_path = sub_console;
      size += sub_size;
    }
  }

  Ok((editor_path, console_path, size))
}
