import React from 'react';

interface ResultTableProps {
  data: Record<string, any>[];
  maxRows?: number;
}

export const ResultTable: React.FC<ResultTableProps> = ({ data, maxRows }) => {
  if (!data || data.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No results. Execute a query to see results.</p>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});
  const displayData = maxRows ? data.slice(0, maxRows) : data;
  const hasMore = maxRows && data.length > maxRows;

  return (
    <div style={styles.container}>
      <div style={styles.info}>
        <span>
          {data.length} row{data.length !== 1 ? 's' : ''}
        </span>
        {hasMore && <span> (showing first {maxRows})</span>}
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={styles.th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, idx) => (
              <tr key={idx} style={styles.tr}>
                {columns.map((col) => (
                  <td key={col} style={styles.td}>
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden',
  },
  info: {
    padding: '8px 12px',
    fontSize: '12px',
    color: '#666',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    fontSize: '14px',
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  th: {
    position: 'sticky' as const,
    top: 0,
    backgroundColor: '#fafafa',
    padding: '8px 12px',
    textAlign: 'left' as const,
    fontWeight: 600,
    borderBottom: '2px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    whiteSpace: 'nowrap' as const,
  },
  tr: {
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '6px 12px',
    borderRight: '1px solid #f0f0f0',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};
