# JQL - JSON Query Language

Browser-based JSON to SQL query explorer for Next.js and React applications.

Query your JSON data using SQL syntax with Monaco Editor auto-completion powered by AlaSQL.

## Features

- 📊 **SQL Querying**: Query JSON data using familiar SQL syntax
- 🎨 **Monaco Editor**: Rich SQL editor with syntax highlighting and auto-completion
- 🔍 **Schema Inference**: Automatic schema detection from your JSON data
- 🌳 **Nested JSON Support**: Flatten nested objects for easy querying
- ⚡ **Client-Side**: All processing happens in the browser - no backend required
- 🎯 **Type Safe**: Full TypeScript support with type definitions
- 🚀 **Next.js Ready**: SSR-safe with App Router support

## Monorepo Structure

```
JQL/
├── packages/
│   └── json-sql-explorer/     # Core library
└── apps/
    └── demo/                   # Next.js demo app
```

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
# Start demo app (runs on http://localhost:3000)
npm run dev

# Build all packages
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Using the Library

### Installation in Your Project

```bash
npm install @jql/json-sql-explorer
# or
yarn add @jql/json-sql-explorer
```

### Next.js App Router Usage

```tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Monaco Editor
const JsonSqlExplorer = dynamic(
  () => import('@jql/json-sql-explorer').then((mod) => mod.JsonSqlExplorer),
  { ssr: false }
);

export default function Page() {
  const data = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 34 },
  ];

  return (
    <JsonSqlExplorer
      data={data}
      initialQuery="SELECT * FROM data WHERE age > 30"
      height={600}
      theme="light"
    />
  );
}
```

### React Usage

```tsx
import { JsonSqlExplorer } from '@jql/json-sql-explorer';

function App() {
  const data = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 34 },
  ];

  return (
    <JsonSqlExplorer
      data={data}
      onResult={(rows) => console.log('Results:', rows)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Nested JSON with Flatten

```tsx
const data = [
  {
    name: 'Alice',
    address: { city: 'NYC', country: 'USA' }
  }
];

<JsonSqlExplorer
  data={data}
  flatten={true}
  initialQuery="SELECT name, [address.city] FROM data"
/>
```

## API Reference

### JsonSqlExplorer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[] \| any` | required | JSON data to query |
| `initialQuery` | `string` | `'SELECT * FROM data LIMIT 10'` | Initial SQL query |
| `onQueryChange` | `(sql: string) => void` | - | Callback when query changes |
| `onResult` | `(rows: Record<string, any>[]) => void` | - | Callback when query executes |
| `onError` | `(error: Error) => void` | - | Callback when error occurs |
| `height` | `number \| string` | `600` | Component height |
| `theme` | `'light' \| 'dark' \| 'vs-dark'` | `'light'` | Editor theme |
| `flatten` | `boolean` | `false` | Flatten nested JSON |
| `maxRows` | `number` | `1000` | Maximum rows to display |
| `tableName` | `string` | `'data'` | SQL table name |
| `showJsonInput` | `boolean` | `false` | Show JSON input panel |
| `readOnly` | `boolean` | `false` | Read-only mode |

## SQL Support

JQL uses [AlaSQL](https://github.com/AlaSQL/alasql) which supports:

- `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`
- Aggregate functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- `JOIN` operations (with multiple tables)
- Subqueries
- Common SQL functions

### Limitations

- Not all SQL features are supported (AlaSQL subset)
- Performance may degrade with very large datasets (10k+ rows)
- Write operations (`INSERT`, `UPDATE`, `DELETE`) are disabled for safety
- Complex nested queries may have limitations

## SSR Considerations (Next.js)

Monaco Editor requires browser APIs and won't work with SSR. Always use dynamic import:

```tsx
const JsonSqlExplorer = dynamic(
  () => import('@jql/json-sql-explorer').then((mod) => mod.JsonSqlExplorer),
  { ssr: false }
);
```

Ensure your `next.config.js` includes:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@jql/json-sql-explorer'],
  webpack: (config, { isServer }) => {
    // Monaco editor requires this
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    // Ignore react-native modules (used by AlaSQL but not needed in browser)
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': false,
      'react-native-fetch-blob': false,
      'react-native-fs': false,
    };

    // Fallback for Node.js modules not available in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
```

## Development

### Project Setup

```bash
# Install dependencies
npm install

# Build library
cd packages/json-sql-explorer
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Testing

Tests are written using Vitest:

```bash
# Run all tests
npm test

# Run tests in a specific package
npm run test --workspace=@jql/json-sql-explorer
```

## Publishing

```bash
# Build library
cd packages/json-sql-explorer
npm run build

# Update version
npm version patch|minor|major

# Publish to npm
npm publish --access public
```

## Known Issues

1. **react-native Module Not Found**: AlaSQL includes optional react-native dependencies. If you see `Can't resolve 'react-native'` or `'react-native-fetch-blob'` errors, add webpack aliases in your `next.config.js` (see SSR Considerations section above).

2. **Monaco Worker Error**: If you see worker-related errors, ensure your bundler is configured to handle Monaco's web workers. Next.js config should include webpack customization for `.ttf` files.

3. **SSR Hydration**: Always use `dynamic` import with `ssr: false` in Next.js. The library contains browser-only code (Monaco Editor) that won't work server-side.

4. **Large Datasets**: Performance degrades with 10k+ rows. Consider pagination or filtering your data first, or use the `maxRows` prop to limit results.

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines first.

## Support

- [GitHub Issues](https://github.com/yourusername/jql/issues)
- [Documentation](https://github.com/yourusername/jql/blob/main/README.md)
