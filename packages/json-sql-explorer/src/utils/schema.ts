import type { SchemaColumn, TableSchema } from '../types';

/**
 * Infers the type of a value
 */
function inferType(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : 'REAL';
  }
  if (typeof value === 'boolean') return 'BOOLEAN';
  if (value instanceof Date) return 'DATE';
  if (Array.isArray(value)) return 'ARRAY';
  if (typeof value === 'object') return 'OBJECT';
  return 'TEXT';
}

/**
 * Infers schema from an array of data
 */
export function inferSchema(
  data: any[],
  tableName: string = 'data'
): TableSchema {
  const columnMap = new Map<string, Set<string>>();

  // Sample first 100 rows for schema inference
  const sampleSize = Math.min(data.length, 100);
  for (let i = 0; i < sampleSize; i++) {
    const row = data[i];
    if (row && typeof row === 'object') {
      for (const key in row) {
        if (Object.prototype.hasOwnProperty.call(row, key)) {
          if (!columnMap.has(key)) {
            columnMap.set(key, new Set());
          }
          const type = inferType(row[key]);
          columnMap.get(key)!.add(type);
        }
      }
    }
  }

  const columns: SchemaColumn[] = Array.from(columnMap.entries()).map(
    ([name, types]) => {
      const typeArray = Array.from(types);
      const hasNull = typeArray.includes('NULL');
      const nonNullTypes = typeArray.filter((t) => t !== 'NULL');

      // Determine primary type (most common non-null type)
      let primaryType = 'TEXT';
      if (nonNullTypes.length === 1) {
        primaryType = nonNullTypes[0];
      } else if (nonNullTypes.length > 1) {
        // Mixed types - prefer TEXT
        if (nonNullTypes.includes('TEXT')) {
          primaryType = 'TEXT';
        } else if (
          nonNullTypes.includes('REAL') &&
          nonNullTypes.includes('INTEGER')
        ) {
          primaryType = 'REAL';
        } else {
          primaryType = nonNullTypes[0];
        }
      }

      return {
        name,
        type: primaryType,
        nullable: hasNull || typeArray.length === 0,
      };
    }
  );

  return {
    tableName,
    columns,
  };
}

/**
 * Generates Monaco completion items from schema
 */
export function generateCompletionItems(schema: TableSchema): any[] {
  const items: any[] = [];

  // Add table name
  items.push({
    label: schema.tableName,
    kind: 15, // monaco.languages.CompletionItemKind.Struct
    insertText: schema.tableName,
    detail: 'Table',
  });

  // Add columns
  schema.columns.forEach((column) => {
    items.push({
      label: column.name,
      kind: 10, // monaco.languages.CompletionItemKind.Field
      insertText: column.name.includes('.') ? `[${column.name}]` : column.name,
      detail: `${column.type}${column.nullable ? ' | NULL' : ''}`,
    });
  });

  // Add SQL keywords
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'HAVING',
    'ORDER BY',
    'LIMIT',
    'OFFSET',
    'AS',
    'AND',
    'OR',
    'NOT',
    'IN',
    'BETWEEN',
    'LIKE',
    'IS NULL',
    'IS NOT NULL',
    'COUNT',
    'SUM',
    'AVG',
    'MIN',
    'MAX',
    'DISTINCT',
    'JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'INNER JOIN',
    'ON',
  ];

  keywords.forEach((keyword) => {
    items.push({
      label: keyword,
      kind: 14, // monaco.languages.CompletionItemKind.Keyword
      insertText: keyword,
      detail: 'SQL Keyword',
    });
  });

  return items;
}
