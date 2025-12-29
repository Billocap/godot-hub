use std::{ fs, io, path::PathBuf, sync::{ LazyLock, Mutex } };

const CONFIG_NAME: &str = "godot-hub.config.json";

pub static STATE: LazyLock<Mutex<SettingsController>> = LazyLock::new(|| {
  let controller = SettingsController {
    config_path: PathBuf::new(),
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

pub struct SettingsController {
  pub settings: Settings,
  pub config_path: PathBuf,
}

impl SettingsController {
  /// Updates the path this settings controller tries to read
  /// when loading a settings file.
  pub fn update_config_path(&mut self, home_path: &PathBuf) {
    self.config_path = home_path.clone();

    self.config_path.push(CONFIG_NAME);
  }

  /// Reads the config file and updates the settings prop
  /// for this controller.
  /// Also returns the settings read from the file.
  pub fn read_config(&mut self) -> Result<Settings, String> {
    let config = fs
      ::read_to_string(&self.config_path)
      .map_err(|e| e.to_string())?;

    let settings: Settings = serde_json
      ::from_str(config.as_str())
      .map_err(|e| e.to_string())?;

    self.settings = settings.clone();

    Ok(settings)
  }

  /// Updates the config file and the settings prop for this controller.
  pub fn write_config(&mut self, data: &Settings) -> io::Result<()> {
    let content = serde_json::to_string(data)?;

    self.settings = data.clone();

    fs::write(&self.config_path, content)
  }
}
