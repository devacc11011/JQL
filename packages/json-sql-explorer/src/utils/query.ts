import alasql from 'alasql';
import type { QueryResult } from '../types';

/**
 * Executes SQL query against JSON data using AlaSQL
 */
export async function executeQuery(
  sql: string,
  data: any[],
  tableName: string = 'data',
  maxRows?: number
): Promise<QueryResult> {
  const startTime = performance.now();

  try {
    // Create temporary table
    alasql(`DROP TABLE IF EXISTS ${tableName}`);
    alasql(`CREATE TABLE ${tableName}`);
    alasql.tables[tableName].data = data;

    // Execute query
    let result: any = alasql(sql);

    // Ensure result is an array
    if (!Array.isArray(result)) {
      result = [result];
    }

    // Apply max rows limit
    const rows = maxRows ? result.slice(0, maxRows) : result;

    const executionTime = performance.now() - startTime;

    return {
      rows,
      executionTime,
      rowCount: result.length,
    };
  } catch (error) {
    throw new Error(
      `Query execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  } finally {
    // Cleanup
    try {
      alasql(`DROP TABLE IF EXISTS ${tableName}`);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Validates SQL query syntax (basic check)
 */
export function validateQuery(sql: string): { valid: boolean; error?: string } {
  const trimmed = sql.trim();

  if (!trimmed) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  // Basic SQL injection prevention
  const dangerous = [
    'DROP TABLE',
    'DELETE FROM',
    'UPDATE',
    'INSERT INTO',
    'CREATE TABLE',
    'ALTER TABLE',
    'TRUNCATE',
  ];

  const upperSql = trimmed.toUpperCase();
  for (const keyword of dangerous) {
    if (upperSql.includes(keyword)) {
      return {
        valid: false,
        error: `Dangerous operation detected: ${keyword}`,
      };
    }
  }

  return { valid: true };
}
