use std::{ fs, path::PathBuf };

use crate::controllers::{
  settings_controller::SettingsController,
  version_controller::VersionController,
};

const DATA_FOLDER: &str = ".godothub";

#[derive(Default)]
pub struct AppController {
  pub cache_folder: PathBuf,
  pub data_folder: PathBuf,
  pub versions: VersionController,
  pub settings: SettingsController,
}

impl AppController {
  /// Updates the path this app controller tries to read
  /// when loading a data files.
  pub fn update_data_path(&mut self, new_path: &PathBuf) {
    self.data_folder = new_path.clone();

    self.data_folder.push(DATA_FOLDER);

    let _ = fs::create_dir(&self.data_folder).map_or((), |b| b);
  }

  /// Updates the path to the cache folder.
  pub fn update_cache_path(&mut self, new_path: &PathBuf) {
    self.cache_folder = new_path.clone();
  }
}
