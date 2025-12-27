import { describe, it, expect } from 'vitest';
import { executeQuery, validateQuery } from './query';

describe('executeQuery', () => {
  it('should execute simple SELECT query', async () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const result = await executeQuery('SELECT * FROM data', data);

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual({ id: 1, name: 'Alice' });
    expect(result.executionTime).toBeGreaterThan(0);
    expect(result.rowCount).toBe(2);
  });

  it('should execute WHERE query', async () => {
    const data = [
      { id: 1, name: 'Alice', age: 28 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Carol', age: 25 },
    ];

    const result = await executeQuery(
      'SELECT name FROM data WHERE age > 27',
      data
    );

    expect(result.rows).toHaveLength(2);
    expect(result.rows.map((r) => r.name)).toEqual(['Alice', 'Bob']);
  });

  it('should execute aggregation query', async () => {
    const data = [
      { dept: 'Eng', salary: 100 },
      { dept: 'Eng', salary: 110 },
      { dept: 'Sales', salary: 90 },
    ];

    const result = await executeQuery(
      'SELECT dept, AVG(salary) as avg_sal FROM data GROUP BY dept',
      data
    );

    expect(result.rows).toHaveLength(2);
    expect(result.rows.find((r) => r.dept === 'Eng')?.avg_sal).toBe(105);
  });

  it('should apply maxRows limit', async () => {
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i }));

    const result = await executeQuery('SELECT * FROM data', data, 'data', 10);

    expect(result.rows).toHaveLength(10);
    expect(result.rowCount).toBe(100);
  });

  it('should throw on invalid query', async () => {
    const data = [{ id: 1 }];

    await expect(
      executeQuery('INVALID SQL', data)
    ).rejects.toThrow();
  });
});

describe('validateQuery', () => {
  it('should accept valid SELECT queries', () => {
    expect(validateQuery('SELECT * FROM data').valid).toBe(true);
    expect(validateQuery('SELECT id WHERE age > 10').valid).toBe(true);
  });

  it('should reject empty queries', () => {
    expect(validateQuery('').valid).toBe(false);
    expect(validateQuery('   ').valid).toBe(false);
  });

  it('should reject dangerous operations', () => {
    expect(validateQuery('DROP TABLE data').valid).toBe(false);
    expect(validateQuery('DELETE FROM data').valid).toBe(false);
    expect(validateQuery('UPDATE data SET x=1').valid).toBe(false);
    expect(validateQuery('INSERT INTO data VALUES (1)').valid).toBe(false);
  });

  it('should be case insensitive for dangerous keywords', () => {
    expect(validateQuery('drop table data').valid).toBe(false);
    expect(validateQuery('DrOp TaBlE data').valid).toBe(false);
  });
});
