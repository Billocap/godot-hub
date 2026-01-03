interface Settings {
  versions_folder: string;
}

interface VersionData {
  id: string;
  size: number;
  name: string;
  path: string;
  editor_path: string;
  console_path: string;
  updated_at: string;
  created_at: string;
}

interface Serializable<S> {
  /**
   * Converts this controllers data to the format accepted by the server.
   *
   * Usually it involves converting `camelCase` to `snake_ase` and verifying
   * none of the necessary keys are `null` or `undefined`.
   *
   * @returns An object formatted in the way accepted by the server.
   */
  serialize(): S;
}

interface Deserializable<S> {
  /**
   * Converts the data to a format that can be assigned to a constructor.
   *
   * Usually it involves converting `snake_case` to `camelCase` and verifying
   * none of the necessary keys are `null` or `undefined`.
   *
   * @param source An object in the way it was returned by the server.
   *
   * @returns A copy of this controller.
   */
  deserialize(source: S): typeof this;
}

interface Cloneable<S> extends Serializable<S>, Deserializable<S> {
  /**
   * Creates a copy of this controller.
   *
   * Uses the `serialize` and `deserialize` methods.
   *
   * @returns A copy of this controller.
   */
  clone(): typeof this;
}
