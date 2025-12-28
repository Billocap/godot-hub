use std::fs;

const CONFIG_PATH: &str = "godot-hub.config.json";

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct ConfigData {
  pub versions_folder: String,
}

pub fn read_config() -> Result<ConfigData, ()> {
  if fs::exists(CONFIG_PATH).unwrap() {
    let config = fs::read_to_string(CONFIG_PATH).unwrap();

    let value: ConfigData = serde_json::from_str(config.as_str()).unwrap();

    Ok(value)
  } else {
    Err(())
  }
}

pub fn write_config(data: &ConfigData) {
  let content = serde_json::to_string(data).unwrap();

  fs::write(CONFIG_PATH, content);
}
