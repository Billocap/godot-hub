import { invoke } from "@tauri-apps/api/core";

import SettingsController from "../controllers/SettingsController";

/**
 * @static
 *
 * Groups `invoke` calls related to the app's settings.
 */
export default class SettingsHandler {
  /**
   * Loads the settings from the settings file.
   *
   * @returns A `SettingsController` containing the app's settings.
   */
  static async loadSettings(): Promise<SettingsController> {
    const source = await invoke<Settings>("load_settings");

    return SettingsController.from(source);
  }

  /**
   * Updates the settings file.
   *
   * @param settings A `SettingsController` containing the new settings.
   */
  static async updateSettings(settings: SettingsController) {
    return invoke("update_settings", {
      settings: settings.serialize(),
    });
  }
}
