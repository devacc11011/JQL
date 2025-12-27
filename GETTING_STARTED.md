# Getting Started with JQL

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## Installation

```bash
# Install dependencies
npm install
```

## Development

### 1. Build the library first

```bash
# Build the library package
npm run build --workspace=@jql/json-sql-explorer

# Or build everything
npm run build
```

### 2. Run the demo app

```bash
# Start demo in development mode
npm run dev

# This will start the Next.js dev server on http://localhost:3000
```

The demo app will automatically use the library via workspace linking.

### 3. Run tests

```bash
# Run all tests
npm test

# Run tests for library only
npm run test --workspace=@jql/json-sql-explorer

# Run tests in watch mode
npm run test:watch --workspace=@jql/json-sql-explorer
```

## Project Structure

```
JQL/
├── packages/
│   └── json-sql-explorer/          # Core library
│       ├── src/
│       │   ├── components/         # React components
│       │   │   ├── JsonSqlExplorer.tsx  # Main component
│       │   │   ├── SqlEditor.tsx        # Monaco editor wrapper
│       │   │   └── ResultTable.tsx      # Results display
│       │   ├── utils/              # Utility functions
│       │   │   ├── flatten.ts           # JSON flattening
│       │   │   ├── schema.ts            # Schema inference
│       │   │   └── query.ts             # Query execution
│       │   ├── types/              # TypeScript types
│       │   └── index.ts            # Public API
│       ├── dist/                   # Built output (generated)
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts         # Build configuration
│
├── apps/
│   └── demo/                       # Next.js demo app
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx           # Main demo page
│       │   └── globals.css
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.js
│
├── package.json                    # Root package (workspace)
├── tsconfig.json                  # Base TypeScript config
├── .eslintrc.json                 # ESLint config
├── .prettierrc.json               # Prettier config
└── README.md                      # Main documentation
```

## Common Commands

### Development
```bash
npm run dev                # Start demo app
npm run build              # Build all packages
npm test                   # Run all tests
npm run lint               # Lint all packages
npm run clean              # Clean all build outputs
```

### Library-specific
```bash
npm run build --workspace=@jql/json-sql-explorer
npm run test --workspace=@jql/json-sql-explorer
npm run lint --workspace=@jql/json-sql-explorer
npm run dev --workspace=@jql/json-sql-explorer  # Watch mode
```

### Demo app-specific
```bash
npm run dev --workspace=demo
npm run build --workspace=demo
npm run start --workspace=demo
```

## Making Changes

### To the library

1. Make changes in `packages/json-sql-explorer/src/`
2. Run `npm run build --workspace=@jql/json-sql-explorer` to build
3. The demo app will pick up changes automatically (if using `npm run dev`)

### To the demo app

1. Make changes in `apps/demo/`
2. Changes will hot-reload automatically with `npm run dev`

## Publishing the Library

```bash
# 1. Build the library
cd packages/json-sql-explorer
npm run build

# 2. Test that everything works
npm test

# 3. Update version
npm version patch|minor|major

# 4. Publish (when ready)
npm publish --access public

# Note: Update package name in package.json before publishing
# Change "@jql/json-sql-explorer" to your own scope
```

## Troubleshooting

### Build fails

If build fails, try:
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Monaco Editor issues in dev

If you see Monaco-related errors:
- Ensure `next.config.js` has `transpilePackages: ['@jql/json-sql-explorer']`
- Make sure you're using dynamic import with `ssr: false`

### Tests fail

If tests fail:
```bash
# Clear cache and re-run
rm -rf node_modules/.vitest
npm test
```

## Next Steps

1. Check out the demo at http://localhost:3000 after running `npm run dev`
2. Read the main [README.md](./README.md) for usage examples
3. Explore the library API in [packages/json-sql-explorer/README.md](./packages/json-sql-explorer/README.md)
4. Try modifying the demo to test new features

## Need Help?

- [Main README](./README.md)
- [Library README](./packages/json-sql-explorer/README.md)
- [Changelog](./CHANGELOG.md)
