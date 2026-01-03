use std::{ fs, io, path::PathBuf };

use crate::controllers::app_controller::AppController;

const CONFIG_NAME: &str = "settings.json";

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Settings {
  pub versions_folder: String,
}

#[derive(Clone)]
pub struct SettingsController {
  pub settings: Settings,
  pub config_path: PathBuf,
}

impl SettingsController {
  pub fn new(new_app: &AppController) -> Self {
    let mut config_path = new_app.data_folder.clone();

    config_path.push(CONFIG_NAME);

    Self {
      settings: Settings {
        versions_folder: String::new(),
      },
      config_path: config_path,
    }
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
