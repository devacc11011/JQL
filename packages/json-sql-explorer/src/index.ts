export { JsonSqlExplorer } from './components/JsonSqlExplorer';
export { SqlEditor } from './components/SqlEditor';
export { ResultTable } from './components/ResultTable';

export type {
  JsonSqlExplorerProps,
  QueryResult,
  SchemaColumn,
  TableSchema,
  QueryError,
} from './types';

export {
  flattenObject,
  flattenArray,
  normalizeData,
  escapeColumnName,
} from './utils/flatten';

export { inferSchema, generateCompletionItems } from './utils/schema';

export { executeQuery, validateQuery } from './utils/query';
