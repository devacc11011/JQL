'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { SqlEditor } from './SqlEditor';
import { ResultTable } from './ResultTable';
import type { JsonSqlExplorerProps, QueryResult } from '../types';
import {
  normalizeData,
  flattenArray,
  escapeColumnName,
} from '../utils/flatten';
import { inferSchema } from '../utils/schema';
import { executeQuery, validateQuery } from '../utils/query';

export const JsonSqlExplorer: React.FC<JsonSqlExplorerProps> = ({
  data,
  initialQuery = 'SELECT * FROM data LIMIT 10',
  onQueryChange,
  onResult,
  onError,
  height = 600,
  theme = 'light',
  flatten = false,
  maxRows = 1000,
  tableName = 'data',
  showJsonInput = false,
  readOnly = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Process data
  const processedData = useMemo(() => {
    let normalized = normalizeData(data);
    if (flatten) {
      normalized = flattenArray(normalized);
    }
    return normalized;
  }, [data, flatten]);

  // Infer schema
  const schema = useMemo(() => {
    if (processedData.length === 0) return undefined;
    return inferSchema(processedData, tableName);
  }, [processedData, tableName]);

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      onQueryChange?.(newQuery);
    },
    [onQueryChange]
  );

  const handleExecute = useCallback(async () => {
    setError(null);
    setResult(null);

    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      setError(validation.error || 'Invalid query');
      onError?.(new Error(validation.error || 'Invalid query'));
      return;
    }

    setIsExecuting(true);

    try {
      const queryResult = await executeQuery(
        query,
        processedData,
        tableName,
        maxRows
      );
      setResult(queryResult);
      onResult?.(queryResult.rows);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsExecuting(false);
    }
  }, [query, processedData, tableName, maxRows, onResult, onError]);

  const handleLoadJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      // This would require data to be controllable - for now just show error
      console.log('Parsed JSON:', parsed);
      alert('JSON loaded successfully (demo mode)');
    } catch (err) {
      setError('Invalid JSON');
    }
  }, [jsonInput]);

  const containerHeight =
    typeof height === 'number' ? `${height}px` : height;

  return (
    <div style={{ ...styles.container, height: containerHeight }}>
      {showJsonInput && (
        <div style={styles.jsonInputPanel}>
          <textarea
            style={styles.textarea}
            placeholder="Paste JSON data here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <button style={styles.button} onClick={handleLoadJson}>
            Load JSON
          </button>
        </div>
      )}

      <div style={styles.editorSection}>
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <span style={styles.label}>SQL Query</span>
            {schema && (
              <span style={styles.schemaInfo}>
                {schema.columns.length} columns, {processedData.length} rows
              </span>
            )}
          </div>
          <button
            style={{
              ...styles.button,
              ...styles.executeButton,
              ...(isExecuting ? styles.buttonDisabled : {}),
            }}
            onClick={handleExecute}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Execute (Ctrl+Enter)'}
          </button>
        </div>
        <SqlEditor
          value={query}
          onChange={handleQueryChange}
          onExecute={handleExecute}
          schema={schema}
          theme={theme}
          readOnly={readOnly}
          height={200}
        />
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={styles.resultsSection}>
          <div style={styles.resultHeader}>
            <span style={styles.label}>Results</span>
            <span style={styles.executionTime}>
              {result.executionTime.toFixed(2)}ms
              {result.rowCount !== result.rows.length &&
                ` (${result.rowCount} total, showing ${result.rows.length})`}
            </span>
          </div>
          <div style={styles.tableContainer}>
            <ResultTable data={result.rows} maxRows={maxRows} />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    overflow: 'hidden',
  },
  jsonInputPanel: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  textarea: {
    flex: 1,
    minHeight: '100px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  editorSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
  },
  schemaInfo: {
    fontSize: '12px',
    color: '#666',
  },
  button: {
    padding: '6px 12px',
    fontSize: '13px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  executeButton: {
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    fontWeight: 500,
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
    fontSize: '13px',
  },
  resultsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: 0,
    overflow: 'hidden',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  executionTime: {
    fontSize: '12px',
    color: '#666',
  },
  tableContainer: {
    flex: 1,
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
};
