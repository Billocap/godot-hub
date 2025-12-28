use std::{ fs, io, path::{ PathBuf } };

const CONFIG_NAME: &str = "godot-hub.config.json";

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ConfigData {
  pub versions_folder: String,
}

pub fn read_config(home_path: &PathBuf) -> Result<ConfigData, String> {
  let mut config_path = home_path.clone();

  config_path.push(CONFIG_NAME);

  let config = fs
    ::read_to_string(&config_path)
    .map_err(|_| String::from("Config file not found!"))?;

  serde_json
    ::from_str(config.as_str())
    .map_err(|_| String::from("Settings data not valid!"))
}

pub fn write_config(home_path: &PathBuf, data: &ConfigData) -> io::Result<()> {
  let mut config_path = home_path.clone();

  config_path.push(CONFIG_NAME);

  let content = serde_json::to_string(data)?;

  fs::write(&config_path, content)
}
