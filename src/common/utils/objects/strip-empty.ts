/**
 * Removes keys whose value is `""`, `null`, or `undefined`.
 * Used to clean form payloads before sending to the API — TypeBox
 * Optional fields default to empty strings in vee-validate, but the
 * backend expects missing keys, not empty strings.
 */
export function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as Array<keyof T>) {
    const value = obj[key];
    if (value !== "" && value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
