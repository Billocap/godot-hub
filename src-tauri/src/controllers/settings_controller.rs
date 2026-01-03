use std::{ fs, io, path::PathBuf, sync::{ LazyLock, Mutex } };

const CONFIG_NAME: &str = "settings.json";

pub static STATE: LazyLock<Mutex<SettingsController>> = LazyLock::new(|| {
  let controller = SettingsController {
    config_path: PathBuf::new(),
    cache_folder: PathBuf::new(),
    settings: Settings {
      versions_folder: String::new(),
    },
  };

  Mutex::new(controller)
});

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Settings {
  pub versions_folder: String,
}

#[derive(Clone)]
pub struct SettingsController {
  pub settings: Settings,
  pub cache_folder: PathBuf,
  pub config_path: PathBuf,
}

impl SettingsController {
  /// Updates the path this settings controller tries to read
  /// when loading a settings file.
  pub fn update_config_path(&mut self, home_path: &PathBuf) {
    self.config_path = home_path.clone();

    self.config_path.push(".godothub");

    if !fs::exists(&self.config_path).map_or(false, |b| b) {
      let _ = fs::create_dir(&self.config_path).map_or((), |b| b);
    }

    self.config_path.push(CONFIG_NAME);
  }

  /// Updates the path to the cache folder.
  pub fn update_cache_path(&mut self, cache_path: &PathBuf) {
    self.cache_folder = cache_path.clone();
  }

  /// Reads the config file and updates the settings prop
  /// for this controller.
  /// Also returns the settings read from the file.
  pub fn read_config(
    &mut self,
    default_path: PathBuf
  ) -> Result<Settings, String> {
    let settings = match fs::read_to_string(&self.config_path) {
      Ok(config) =>
        serde_json::from_str(config.as_str()).map_err(|e| e.to_string())?,
      Err(_) => {
        let data = Settings {
          versions_folder: default_path
            .as_os_str()
            .to_str()
            .unwrap()
            .to_owned(),
        };

        let content = serde_json
          ::to_string_pretty(&data)
          .map_err(|e| e.to_string())?;

        fs::write(&self.config_path, content).map_err(|e| e.to_string())?;

        data
      }
    };

    if !fs::exists(&settings.versions_folder).map_or(false, |b| b) {
      fs::create_dir(&settings.versions_folder).map_err(|e| e.to_string())?;
    }

    self.settings = settings.clone();

    Ok(settings)
  }

  /// Updates the config file and the settings prop for this controller.
  pub fn write_config(&mut self, data: &Settings) -> io::Result<()> {
    let content = serde_json::to_string_pretty(data)?;

    self.settings = data.clone();

    fs::write(&self.config_path, content)
  }
}
