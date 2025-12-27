'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import to avoid SSR issues with Monaco
const JsonSqlExplorer = dynamic(
  () =>
    import('browser-json-sql').then((mod) => ({
      default: mod.JsonSqlExplorer,
    })),
  { ssr: false }
);

// Sample data
const sampleUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 28,
    department: 'Engineering',
    salary: 95000,
    address: {
      city: 'San Francisco',
      country: 'USA',
    },
    skills: ['JavaScript', 'React', 'Node.js'],
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    age: 34,
    department: 'Product',
    salary: 105000,
    address: {
      city: 'New York',
      country: 'USA',
    },
    skills: ['Product Management', 'Analytics'],
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    age: 29,
    department: 'Engineering',
    salary: 98000,
    address: {
      city: 'Austin',
      country: 'USA',
    },
    skills: ['Python', 'Django', 'PostgreSQL'],
  },
  {
    id: 4,
    name: 'David Lee',
    email: 'david@example.com',
    age: 31,
    department: 'Design',
    salary: 92000,
    address: {
      city: 'Seattle',
      country: 'USA',
    },
    skills: ['UI/UX', 'Figma', 'Sketch'],
  },
  {
    id: 5,
    name: 'Eve Martinez',
    email: 'eve@example.com',
    age: 27,
    department: 'Engineering',
    salary: 100000,
    address: {
      city: 'Los Angeles',
      country: 'USA',
    },
    skills: ['Go', 'Kubernetes', 'Docker'],
  },
];

const exampleQueries = [
  {
    label: 'All users',
    query: 'SELECT * FROM data',
  },
  {
    label: 'Engineering dept',
    query: "SELECT name, email, salary FROM data WHERE department = 'Engineering'",
  },
  {
    label: 'Avg salary by dept',
    query:
      'SELECT department, AVG(salary) as avg_salary FROM data GROUP BY department ORDER BY avg_salary DESC',
  },
  {
    label: 'Age > 30',
    query: 'SELECT name, age, department FROM data WHERE age > 30',
  },
  {
    label: 'Top 3 salaries',
    query: 'SELECT name, salary FROM data ORDER BY salary DESC LIMIT 3',
  },
];

const exampleQueriesFlat = [
  {
    label: 'All users (flat)',
    query: 'SELECT * FROM data',
  },
  {
    label: 'City filter',
    query: "SELECT name, [address.city] FROM data WHERE [address.city] = 'San Francisco'",
  },
  {
    label: 'Group by country',
    query:
      'SELECT [address.country], COUNT(*) as count FROM data GROUP BY [address.country]',
  },
];

export default function Home() {
  const [flatten, setFlatten] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('SELECT * FROM data LIMIT 10');

  const queries = flatten ? exampleQueriesFlat : exampleQueries;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>JQL - JSON Query Language</h1>
        <p style={styles.subtitle}>
          Browser-based JSON to SQL query explorer powered by AlaSQL and Monaco
          Editor
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={flatten}
                onChange={(e) => setFlatten(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Flatten nested JSON</span>
            </label>
          </div>

          <div style={styles.exampleQueries}>
            <span style={styles.exampleLabel}>Example queries:</span>
            {queries.map((example, idx) => (
              <button
                key={idx}
                style={styles.exampleButton}
                onClick={() => setCurrentQuery(example.query)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.explorerContainer}>
          <JsonSqlExplorer
            data={sampleUsers}
            initialQuery={currentQuery}
            height={700}
            theme="light"
            flatten={flatten}
            maxRows={100}
            onQueryChange={(sql) => console.log('Query changed:', sql)}
            onResult={(rows) => console.log('Query result:', rows)}
            onError={(error) => console.error('Query error:', error)}
          />
        </div>

        <div style={styles.info}>
          <h2 style={styles.infoTitle}>About</h2>
          <ul style={styles.infoList}>
            <li>Query JSON data using SQL syntax</li>
            <li>
              Monaco Editor with auto-completion for columns and SQL keywords
            </li>
            <li>Supports nested JSON with flatten option</li>
            <li>Execute queries with Ctrl+Enter (Cmd+Enter on Mac)</li>
            <li>Powered by AlaSQL (browser-based SQL engine)</li>
          </ul>

          <h3 style={styles.infoSubtitle}>Limitations</h3>
          <ul style={styles.infoList}>
            <li>AlaSQL supports a subset of SQL - not all features available</li>
            <li>
              Performance may degrade with very large datasets (10k+ rows)
            </li>
            <li>
              Modifications (INSERT, UPDATE, DELETE) are disabled for safety
            </li>
          </ul>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>
          Built with ❤️ using Next.js, React, Monaco Editor, and AlaSQL
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    padding: '32px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#111',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  main: {
    flex: 1,
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '24px',
  },
  controls: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  controlGroup: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
  },
  exampleQueries: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    alignItems: 'center',
  },
  exampleLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#666',
  },
  exampleButton: {
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  explorerContainer: {
    marginBottom: '32px',
  },
  info: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '12px',
  },
  infoSubtitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '20px',
    marginBottom: '8px',
  },
  infoList: {
    paddingLeft: '24px',
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#555',
  },
  footer: {
    padding: '24px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#666',
  },
};
