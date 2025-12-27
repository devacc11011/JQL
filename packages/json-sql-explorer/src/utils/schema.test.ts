import { describe, it, expect } from 'vitest';
import { inferSchema, generateCompletionItems } from './schema';

describe('inferSchema', () => {
  it('should infer schema from simple data', () => {
    const data = [
      { id: 1, name: 'Alice', age: 28 },
      { id: 2, name: 'Bob', age: 30 },
    ];

    const schema = inferSchema(data);

    expect(schema.tableName).toBe('data');
    expect(schema.columns).toHaveLength(3);
    expect(schema.columns.find((c) => c.name === 'id')?.type).toBe('INTEGER');
    expect(schema.columns.find((c) => c.name === 'name')?.type).toBe('TEXT');
    expect(schema.columns.find((c) => c.name === 'age')?.type).toBe('INTEGER');
  });

  it('should handle nullable fields', () => {
    const data = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: null },
    ];

    const schema = inferSchema(data);

    const emailCol = schema.columns.find((c) => c.name === 'email');
    expect(emailCol?.nullable).toBe(true);
  });

  it('should handle mixed types', () => {
    const data = [
      { id: 1, value: 42 },
      { id: 2, value: 3.14 },
    ];

    const schema = inferSchema(data);

    const valueCol = schema.columns.find((c) => c.name === 'value');
    // Mixed INTEGER and REAL should resolve to REAL
    expect(valueCol?.type).toBe('REAL');
  });

  it('should handle empty data', () => {
    const schema = inferSchema([]);

    expect(schema.tableName).toBe('data');
    expect(schema.columns).toHaveLength(0);
  });

  it('should use custom table name', () => {
    const data = [{ id: 1 }];
    const schema = inferSchema(data, 'users');

    expect(schema.tableName).toBe('users');
  });
});

describe('generateCompletionItems', () => {
  it('should generate completion items', () => {
    const schema = {
      tableName: 'users',
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false },
        { name: 'name', type: 'TEXT', nullable: true },
      ],
    };

    const items = generateCompletionItems(schema);

    // Should include table, columns, and keywords
    expect(items.length).toBeGreaterThan(2);

    // Check table
    const tableItem = items.find((i) => i.label === 'users');
    expect(tableItem).toBeDefined();
    expect(tableItem?.kind).toBe(15);

    // Check columns
    const idItem = items.find((i) => i.label === 'id');
    expect(idItem).toBeDefined();
    expect(idItem?.kind).toBe(10);

    // Check keywords
    const selectItem = items.find((i) => i.label === 'SELECT');
    expect(selectItem).toBeDefined();
    expect(selectItem?.kind).toBe(14);
  });

  it('should escape column names with dots', () => {
    const schema = {
      tableName: 'data',
      columns: [{ name: 'address.city', type: 'TEXT', nullable: false }],
    };

    const items = generateCompletionItems(schema);

    const colItem = items.find((i) => i.label === 'address.city');
    expect(colItem?.insertText).toBe('[address.city]');
  });
});
