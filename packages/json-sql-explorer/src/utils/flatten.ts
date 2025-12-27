/**
 * Flattens nested JSON objects into a single-level object with dot notation keys
 */
export function flattenObject(
  obj: any,
  prefix: string = '',
  result: Record<string, any> = {}
): Record<string, any> {
  if (obj === null || obj === undefined) {
    return result;
  }

  if (typeof obj !== 'object' || obj instanceof Date || Array.isArray(obj)) {
    result[prefix] = obj;
    return result;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        flattenObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

/**
 * Flattens an array of objects
 */
export function flattenArray(data: any[]): Record<string, any>[] {
  return data.map((item) => flattenObject(item));
}

/**
 * Normalizes data input to array format
 */
export function normalizeData(data: any): any[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    return [data];
  }
  return [];
}

/**
 * Escapes column names with special characters for SQL
 */
export function escapeColumnName(name: string): string {
  // If column name contains dots or special chars, wrap in brackets
  if (name.includes('.') || name.includes(' ') || /[^a-zA-Z0-9_]/.test(name)) {
    return `[${name}]`;
  }
  return name;
}
