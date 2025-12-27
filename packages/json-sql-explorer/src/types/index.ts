export interface JsonSqlExplorerProps {
  /** JSON data to query - array or single object */
  data: any[] | any;
  /** Initial SQL query to display */
  initialQuery?: string;
  /** Callback when query text changes */
  onQueryChange?: (sql: string) => void;
  /** Callback when query is executed with results */
  onResult?: (rows: Record<string, any>[]) => void;
  /** Callback when query execution fails */
  onError?: (error: Error) => void;
  /** Height of the component */
  height?: number | string;
  /** Theme for Monaco editor */
  theme?: 'light' | 'dark' | 'vs-dark';
  /** Flatten nested JSON objects */
  flatten?: boolean;
  /** Maximum rows to display in results */
  maxRows?: number;
  /** Custom table name (default: 'data') */
  tableName?: string;
  /** Show JSON input panel */
  showJsonInput?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
}

export interface QueryResult {
  rows: Record<string, any>[];
  executionTime: number;
  rowCount: number;
}

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export interface TableSchema {
  tableName: string;
  columns: SchemaColumn[];
}

export interface QueryError {
  message: string;
  line?: number;
  column?: number;
}
