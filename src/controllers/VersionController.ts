import ControllerClass from "../lib/ControllerClass";

type S = VersionData;

export default class VersionController
  extends ControllerClass
  implements Cloneable<S>
{
  public id = "";
  public size = 0;
  public name = "Version";

  public path = "";
  public editorPath = "";
  public consolePath = "";

  public updatedAt = "";
  public createdAt = "";

  serialize(): S {
    const {
      id,
      size,
      name,
      path,
      editorPath,
      consolePath,
      updatedAt,
      createdAt,
    } = this;

    return {
      id,
      size,
      name,
      path,
      editor_path: editorPath,
      console_path: consolePath,
      updated_at: updatedAt,
      created_at: createdAt,
    };
  }

  deserialize(source: S): this {
    const {
      id,
      size,
      name,
      path,
      editor_path,
      console_path,
      updated_at,
      created_at,
    } = source;

    return this.assign({
      id,
      name,
      size,
      path,
      editorPath: editor_path,
      consolePath: console_path,
      updatedAt: updated_at,
      createdAt: created_at,
    });
  }

  clone(): VersionController {
    const clone = new VersionController();

    return clone.deserialize(this.serialize());
  }

  static from(source: S): VersionController {
    const controller = new VersionController();

    return controller.deserialize(source);
  }
}
