/**
 * @abstract
 *
 * Base class for controllers.
 */
export default abstract class ControllerClass {
  /**
   * @readonly
   *
   * Unique key for this item.
   */
  public readonly key = btoa(`${Date.now()}${Math.random()}`);

  /**
   * Copies all the values from a `source` object sent by the server to
   * this object.
   *
   * @param source Source data as it came from the server.
   */
  assign<T extends Record<string | number, any>>(source?: T) {
    if (source === null || source === undefined) return this;

    if ("key" in source) delete source.key;

    return Object.assign(this, source);
  }
}
