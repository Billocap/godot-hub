import { invoke } from "@tauri-apps/api/core";

import VersionController from "../controllers/VersionController";

type VersionMap = Record<string, VersionData>;

/**
 * @static
 *
 * Groups `invoke` calls related to Godot's versions.
 */
export default class VersionsHandler {
  static async listInstalledVersions(): Promise<VersionController[]> {
    const installed = await invoke<VersionMap>("list_versions");

    return Object.values(installed).map(VersionController.from);
  }

  static async installVersion(
    atPath: string,
    id: number,
    version: string,
    url: string,
    assetName: string
  ): Promise<VersionMap> {
    return invoke<VersionMap>("download_version", {
      atPath,
      id,
      version,
      url,
      assetName,
    });
  }

  static async uninstallVersion(id: string) {
    return invoke("remove_version", { id });
  }

  static async runEditor(id: string) {
    return invoke("start_editor", { id });
  }
}
