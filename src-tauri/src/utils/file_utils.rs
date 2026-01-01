use std::{ fs, path::PathBuf };

pub fn copy_folder(from: &PathBuf, to: &PathBuf) -> Result<(), String> {
  let contents = fs::read_dir(&from).map_err(|e| e.to_string())?;

  fs::create_dir(to).map_err(|e| e.to_string())?;

  for content in contents {
    let entry = content.map_err(|e| e.to_string())?.path();
    let file_name: PathBuf = entry.file_name().unwrap().into();
    let to_entry: PathBuf = [to, &file_name].iter().collect();

    if entry.is_file() {
      fs::copy(&entry, &to_entry).map_err(|e| e.to_string())?;
    }

    if entry.is_dir() {
      copy_folder(&entry, &to_entry)?;
    }
  }

  Ok(())
}
