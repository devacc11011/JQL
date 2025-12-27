import { describe, it, expect } from 'vitest';
import {
  flattenObject,
  flattenArray,
  normalizeData,
  escapeColumnName,
} from './flatten';

describe('flattenObject', () => {
  it('should flatten nested object', () => {
    const input = {
      name: 'Alice',
      address: {
        city: 'NYC',
        country: 'USA',
      },
    };

    const result = flattenObject(input);

    expect(result).toEqual({
      name: 'Alice',
      'address.city': 'NYC',
      'address.country': 'USA',
    });
  });

  it('should handle deeply nested objects', () => {
    const input = {
      user: {
        profile: {
          name: 'Bob',
          age: 30,
        },
      },
    };

    const result = flattenObject(input);

    expect(result).toEqual({
      'user.profile.name': 'Bob',
      'user.profile.age': 30,
    });
  });

  it('should handle arrays as values', () => {
    const input = {
      name: 'Carol',
      skills: ['JS', 'Python'],
    };

    const result = flattenObject(input);

    expect(result).toEqual({
      name: 'Carol',
      skills: ['JS', 'Python'],
    });
  });

  it('should handle null and undefined', () => {
    const input = {
      a: null,
      b: undefined,
      c: 'valid',
    };

    const result = flattenObject(input);

    expect(result).toEqual({
      a: null,
      b: undefined,
      c: 'valid',
    });
  });
});

describe('flattenArray', () => {
  it('should flatten array of objects', () => {
    const input = [
      { name: 'Alice', meta: { age: 28 } },
      { name: 'Bob', meta: { age: 30 } },
    ];

    const result = flattenArray(input);

    expect(result).toEqual([
      { name: 'Alice', 'meta.age': 28 },
      { name: 'Bob', 'meta.age': 30 },
    ]);
  });
});

describe('normalizeData', () => {
  it('should keep arrays as is', () => {
    const input = [{ a: 1 }, { a: 2 }];
    expect(normalizeData(input)).toBe(input);
  });

  it('should wrap single object in array', () => {
    const input = { a: 1 };
    expect(normalizeData(input)).toEqual([{ a: 1 }]);
  });

  it('should return empty array for invalid input', () => {
    expect(normalizeData(null)).toEqual([]);
    expect(normalizeData(undefined)).toEqual([]);
    expect(normalizeData('string')).toEqual([]);
  });
});

describe('escapeColumnName', () => {
  it('should not escape simple names', () => {
    expect(escapeColumnName('name')).toBe('name');
    expect(escapeColumnName('user_id')).toBe('user_id');
  });

  it('should escape names with dots', () => {
    expect(escapeColumnName('address.city')).toBe('[address.city]');
  });

  it('should escape names with spaces', () => {
    expect(escapeColumnName('first name')).toBe('[first name]');
  });

  it('should escape names with special characters', () => {
    expect(escapeColumnName('user-id')).toBe('[user-id]');
  });
});
