use std::{ collections::HashMap, fs::{ self, File }, io, path::PathBuf };

use regex::{ Regex };
use serde::{ Deserialize, Serialize };
use tauri::{ webview::cookie::time::{ OffsetDateTime, format_description } };
use uuid::Uuid;
use zip::ZipArchive;

use crate::{
  controllers::{ app_controller::{ AppController } },
  utils::file_utils,
};

const DATA_FILE: &str = "versions.json";
const VERSION_REGEX: &str = r"^v?\d+\.\d+(\.\d+)?-stable";
const EXE_REGEX: &str = r"^[Gg]odot_v?\d+\.\d+(\.\d+)?-stable(_mono)?";
const DATA_FORMAT: &str = "[year]-[month]-[day] [hour]:[minute]:[second]";

#[derive(Serialize, Deserialize, Clone)]
pub struct VersionData {
  pub id: String,
  pub name: String,
  pub size: u64,
  pub path: PathBuf,
  pub manifest_path: PathBuf,
  pub editor_path: PathBuf,
  pub console_path: PathBuf,
  pub updated_at: String,
  pub created_at: String,
}

impl VersionData {
  pub fn save_manifest(&self) -> Result<(), String> {
    let content = serde_json
      ::to_string_pretty(&self)
      .map_err(|e| e.to_string())?;

    fs::write(&self.manifest_path, content).map_err(|e| e.to_string())
  }
}

#[derive(Clone, Default)]
pub struct VersionController {
  pub data_path: PathBuf,
  pub versions: HashMap<String, VersionData>,
}

impl VersionController {
  pub fn new(new_app: &AppController) -> Self {
    let mut data_path = new_app.data_folder.clone();

    data_path.push(DATA_FILE);

    Self {
      data_path: data_path,
      versions: HashMap::new(),
    }
  }

  pub fn load_installed(
    &mut self
  ) -> Result<HashMap<String, VersionData>, String> {
    let content = fs
      ::read_to_string(&self.data_path)
      .map_err(|e| e.to_string())?;

    let data: HashMap<String, VersionData> = serde_json
      ::from_str(&content.as_str())
      .map_err(|e| e.to_string())?;

    self.versions = data.clone();

    Ok(data)
  }

  pub fn save_data(&self) -> io::Result<()> {
    let content = serde_json::to_string_pretty(&self.versions)?;

    fs::write(&self.data_path, content)
  }

  pub fn import_version(&self, entry: &PathBuf) -> Result<VersionData, String> {
    let hub_folder: PathBuf = [entry, &".godothub".into()].iter().collect();

    let _ = fs::create_dir(&hub_folder).map_or((), |e| e);

    let date_format = format_description
      ::parse(DATA_FORMAT)
      .map_err(|e| e.to_string())?;
    let manifest_path: PathBuf = [&hub_folder, &"manifest.json".into()]
      .iter()
      .collect();

    match file_utils::read_json(&manifest_path) {
      Ok(data) => Ok(data),
      Err(_) => {
        let folder_name = entry
          .file_name()
          .unwrap()
          .to_str()
          .unwrap()
          .to_owned();

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
        let manifest_path = entry
          .clone()
          .join(".godothub")
          .join("manifest.json");

        let data = VersionData {
          id: Uuid::new_v4().to_string(),
          name: folder_name,
          path: entry.clone(),
          manifest_path: manifest_path,
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

        data.save_manifest()?;

        Ok(data)
      }
    }
  }

  pub fn import_versions(
    &mut self,
    path: &String
  ) -> Result<HashMap<String, VersionData>, String> {
    let contents = fs::read_dir(path).map_err(|e| e.to_string())?;
    let version_regex = Regex::new(VERSION_REGEX).map_err(|e| e.to_string())?;

    for content in contents {
      let entry = content.map_err(|e| e.to_string())?.path();
      let folder_name = entry.file_name().unwrap().to_str().unwrap().to_owned();

      if entry.is_dir() && version_regex.is_match(&folder_name) {
        let data = self.import_version(&entry)?;

        self.versions.insert(data.id.clone(), data);
      }
    }

    self.save_data().map_err(|e| e.to_string())?;

    Ok(self.versions.clone())
  }

  pub fn install_version(
    &mut self,
    cache: &PathBuf,
    asset_name: String,
    version: &String,
    at_path: &String,
    notify: impl Fn(&str)
  ) -> Result<HashMap<String, VersionData>, String> {
    let target = at_path;

    let target_path: PathBuf = [cache, &asset_name.into()].iter().collect();

    notify("Reading temp file...");

    let reader = File::open(&target_path).map_err(|e| e.to_string())?;

    let mut archive = ZipArchive::new(reader).map_err(|e| e.to_string())?;

    let temp_result_path: PathBuf = [cache, &version.into()].iter().collect();

    let result_path: PathBuf = [target, &version.into()].iter().collect();

    let _ = fs::create_dir(&target).map_or((), |e| e);

    notify("Extracting ZIP...");

    archive.extract(&temp_result_path).map_err(|e| e.to_string())?;

    file_utils::copy_folder(&temp_result_path, &result_path)?;

    notify("Cleaning Up...");

    fs::remove_dir_all(&temp_result_path).map_err(|e| e.to_string())?;
    fs::remove_file(&target_path).map_err(|e| e.to_string())?;

    let new_data = self.import_version(&result_path)?;

    self.versions.insert(new_data.id.clone(), new_data);

    self.save_data().map_err(|e| e.to_string())?;

    Ok(self.versions.clone())
  }

  pub fn remove_version(&mut self, id: String) -> Result<VersionData, String> {
    let removed = self.versions.remove(&id).unwrap();

    fs::remove_dir_all(&removed.path).map_err(|e| e.to_string())?;

    self.save_data().map_err(|e| e.to_string())?;

    Ok(removed)
  }
}

fn get_folder_data(
  folder: &PathBuf
) -> Result<(PathBuf, PathBuf, u64), String> {
  let exe_regex = Regex::new(EXE_REGEX).map_err(|e| e.to_string())?;
  let contents = fs::read_dir(folder).map_err(|e| e.to_string())?;

  let mut editor_path = PathBuf::new();
  let mut console_path = PathBuf::new();
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
      if file_name.contains("console") {
        console_path = entry.clone();
      } else {
        editor_path = entry.clone();
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

pub async fn download_version(
  url: &String,
  cache: &PathBuf,
  asset_name: &String
) -> Result<(), String> {
  let contents = reqwest
    ::get(url).await
    .map_err(|e| e.to_string())?
    .bytes().await
    .map_err(|e| e.to_string())?;

  let target_path: PathBuf = [cache, &asset_name.into()].iter().collect();

  fs::write(target_path, contents).map_err(|e| e.to_string())?;

  Ok(())
}
