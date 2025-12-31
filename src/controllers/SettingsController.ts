import ControllerClass from "../lib/ControllerClass";

type S = Settings;

export default class SettingsController
  extends ControllerClass
  implements Cloneable<S>
{
  public versionsFolder: string = "";

  serialize(): S {
    return {
      versions_folder: this.versionsFolder,
    };
  }

  deserialize(source: S): this {
    return this.assign({
      versionsFolder: source.versions_folder,
    });
  }

  clone(): SettingsController {
    const clone = new SettingsController();

    return clone.deserialize(this.serialize());
  }

  static from(source: S): SettingsController {
    const controller = new SettingsController();

    return controller.deserialize(source);
  }
}
