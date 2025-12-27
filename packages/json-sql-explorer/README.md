# @jql/json-sql-explorer

Browser-based JSON to SQL query explorer for React and Next.js applications.

## Installation

```bash
npm install @jql/json-sql-explorer
```

## Quick Start

### Next.js App Router

```tsx
'use client';

import dynamic from 'next/dynamic';

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
      height={600}
      theme="light"
    />
  );
}
```

### React

```tsx
import { JsonSqlExplorer } from '@jql/json-sql-explorer';

function App() {
  const data = [/* your data */];

  return (
    <JsonSqlExplorer
      data={data}
      onResult={(rows) => console.log(rows)}
    />
  );
}
```

## Features

- SQL querying with Monaco Editor
- Auto-completion for columns and SQL keywords
- Nested JSON support with flatten option
- Type-safe with TypeScript
- SSR-safe for Next.js

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[] \| any` | required | JSON data to query |
| `initialQuery` | `string` | `'SELECT * FROM data LIMIT 10'` | Initial SQL query |
| `onQueryChange` | `(sql: string) => void` | - | Query change callback |
| `onResult` | `(rows: Record<string, any>[]) => void` | - | Result callback |
| `onError` | `(error: Error) => void` | - | Error callback |
| `height` | `number \| string` | `600` | Component height |
| `theme` | `'light' \| 'dark' \| 'vs-dark'` | `'light'` | Editor theme |
| `flatten` | `boolean` | `false` | Flatten nested JSON |
| `maxRows` | `number` | `1000` | Max rows to display |
| `tableName` | `string` | `'data'` | SQL table name |

## Examples

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

### Callbacks

```tsx
<JsonSqlExplorer
  data={data}
  onQueryChange={(sql) => console.log('Query:', sql)}
  onResult={(rows) => console.log('Results:', rows)}
  onError={(error) => console.error('Error:', error)}
/>
```

## SSR (Next.js)

Always use dynamic import with `ssr: false`:

```tsx
const JsonSqlExplorer = dynamic(
  () => import('@jql/json-sql-explorer').then((mod) => mod.JsonSqlExplorer),
  { ssr: false }
);
```

Add to `next.config.js`:

```js
module.exports = {
  transpilePackages: ['@jql/json-sql-explorer'],
};
```

## License

MIT
