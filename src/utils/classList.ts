/**
 * Creates a string to be used as a className property.
 * Functions, `undefined`, objects, `null` and `NaN` are ignored.
 * @param classes List of string classes.
 * @returns A valid css string.
 */
export default function classList(...classes: any[]) {
  const validClasses = classes.filter((c) => {
    const t = typeof c;

    switch (t) {
      case "string":
        return c.length > 0;

      case "number":
        return !Number.isNaN(c);

      default:
        return t !== "object" && t !== "undefined" && t !== "function";
    }
  });

  return validClasses.join(" ").replaceAll(/\s\s+/g, " ").trim();
}
