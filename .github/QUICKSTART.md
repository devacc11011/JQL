# Quick Start Guide - Publishing to npm

Follow these steps to publish your library to npm using GitHub Actions.

## Step 1: Get npm Token

1. Create an npm account at https://www.npmjs.com (if you don't have one)
2. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
3. Click "Generate New Token" → "Classic Token"
4. Select **"Automation"** type
5. Copy the token (save it somewhere safe!)

## Step 2: Add Token to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **"Add secret"**

## Step 3: Update Package Name (Important!)

Before publishing, update the package name to avoid conflicts:

```bash
# Edit packages/json-sql-explorer/package.json
# Change:
"name": "@jql/json-sql-explorer"

# To your own scope:
"name": "@yourname/json-sql-explorer"
# or just:
"name": "your-package-name"
```

Also update in:
- `apps/demo/package.json` (dependencies section)
- `README.md` (all examples)

## Step 4: Test Locally

Make sure everything works:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build --workspace=@jql/json-sql-explorer

# Build demo (to verify integration)
npm run build --workspace=demo
```

## Step 5: Create First Release

### Option A: Using GitHub UI (Easiest)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Release** workflow
4. Click **"Run workflow"**
5. Select **patch** (for version 0.1.0)
6. Click **"Run workflow"** button
7. Wait for completion (~2-3 minutes)
8. Check npm: https://www.npmjs.com/package/YOUR_PACKAGE_NAME

### Option B: Using Git Tags

```bash
# Update version
cd packages/json-sql-explorer
npm version patch  # Creates 0.1.1

# Commit and push
cd ../..
git add .
git commit -m "chore: bump version"
git push origin main

# Push tag (this triggers publish workflow)
git push origin --tags
```

## Step 6: Verify Publication

1. Go to https://www.npmjs.com/package/YOUR_PACKAGE_NAME
2. Check that your package appears
3. Verify version number
4. Test installation:
   ```bash
   npm install YOUR_PACKAGE_NAME
   ```

## Step 7: Test in Real Project

Create a new Next.js project and test your package:

```bash
npx create-next-app@latest test-app
cd test-app
npm install YOUR_PACKAGE_NAME
```

Create `app/page.tsx`:
```tsx
'use client';

import dynamic from 'next/dynamic';

const JsonSqlExplorer = dynamic(
  () => import('YOUR_PACKAGE_NAME').then((mod) => mod.JsonSqlExplorer),
  { ssr: false }
);

export default function Home() {
  const data = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 34 },
  ];

  return <JsonSqlExplorer data={data} height={600} />;
}
```

Update `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['YOUR_PACKAGE_NAME'],
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native': false,
      'react-native-fetch-blob': false,
      'react-native-fs': false,
    };

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

Run:
```bash
npm run dev
```

## Common Issues

### "Cannot publish over the previously published versions"

The version already exists on npm. Bump the version:
```bash
cd packages/json-sql-explorer
npm version patch
git push origin main --tags
```

### "You do not have permission to publish"

- Make sure you're logged in to npm: `npm login`
- Check package name isn't taken
- For scoped packages (@yourname/package), make sure you have access to that scope

### Workflow fails on "Publish to npm"

- Check `NPM_TOKEN` secret is set correctly
- Verify token hasn't expired
- Make sure token type is "Automation"

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced deployment strategies
- Set up automatic CHANGELOG generation
- Add code coverage badges
- Configure semantic-release for automated versioning

## Support

If you encounter issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review GitHub Actions logs
3. Verify npm token permissions
4. Check package.json configuration
