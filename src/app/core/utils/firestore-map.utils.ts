export const removeUndefinedFields = <T extends Record<string, unknown>>(
  obj: T
): T => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
};
