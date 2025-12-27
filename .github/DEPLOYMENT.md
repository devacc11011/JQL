# Deployment Guide

This guide explains how to deploy the `@jql/json-sql-explorer` package to npm using GitHub Actions.

## Prerequisites

1. **npm Account**: You need an npm account. Sign up at [npmjs.com](https://www.npmjs.com)

2. **npm Access Token**: Generate an access token from npm
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token (you won't see it again!)

3. **GitHub Repository Secrets**: Add the npm token to your GitHub repository
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

## Deployment Methods

### Method 1: Automatic Release (Recommended)

Use the GitHub Actions workflow to create a release:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Release" workflow
4. Click "Run workflow"
5. Choose version bump type:
   - `patch`: Bug fixes (0.1.0 → 0.1.1)
   - `minor`: New features (0.1.0 → 0.2.0)
   - `major`: Breaking changes (0.1.0 → 1.0.0)
6. Click "Run workflow"

This will:
- Run all tests
- Build the library
- Bump the version
- Create a git tag
- Push to GitHub
- Automatically trigger the publish workflow

### Method 2: Manual Tag Push

1. Update version locally:
```bash
cd packages/json-sql-explorer
npm version patch  # or minor, or major
```

2. Push the tag:
```bash
git push origin main
git push origin --tags
```

3. The `publish.yml` workflow will automatically trigger and deploy to npm

### Method 3: Manual Deployment (Not Recommended)

If you need to deploy manually:

```bash
# 1. Build the library
npm run build --workspace=@jql/json-sql-explorer

# 2. Test
npm run test --workspace=@jql/json-sql-explorer

# 3. Login to npm (if not already)
npm login

# 4. Publish
cd packages/json-sql-explorer
npm publish --access public
```

## Workflows Explained

### 1. `publish.yml` - Publish to npm

**Trigger**: When a version tag is pushed (e.g., `v1.0.0`)

**What it does**:
- Checks out code
- Installs dependencies
- Runs tests
- Builds the library
- Publishes to npm
- Creates a GitHub release

### 2. `test.yml` - Continuous Integration

**Trigger**: Push to `main` or `develop` branches, or pull requests

**What it does**:
- Tests on Node.js 18 and 20
- Runs linter
- Runs tests
- Builds library and demo app

### 3. `release.yml` - Create Release

**Trigger**: Manual workflow dispatch

**What it does**:
- Runs tests
- Builds library
- Bumps version
- Updates CHANGELOG
- Creates and pushes git tag
- Triggers publish workflow

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes (backward compatible)

## Pre-Release Versions

For beta or alpha releases:

```bash
cd packages/json-sql-explorer

# Beta release
npm version prerelease --preid=beta
# Example: 1.0.0 → 1.0.1-beta.0

# Alpha release
npm version prerelease --preid=alpha
# Example: 1.0.0 → 1.0.1-alpha.0
```

Then push the tag:
```bash
git push origin main --tags
```

## Troubleshooting

### Publishing Fails

**Error: "You must be logged in to publish packages"**
- Check that `NPM_TOKEN` secret is set correctly in GitHub
- Verify the token hasn't expired

**Error: "You do not have permission to publish"**
- Make sure you're a member of the npm organization/scope
- Check package name doesn't conflict with existing packages

**Error: "This package name is not allowed"**
- Update the package name in `packages/json-sql-explorer/package.json`
- Change `@jql/json-sql-explorer` to your own scope

### Tests Fail

If tests fail during the workflow:
```bash
# Run tests locally first
npm test --workspace=@jql/json-sql-explorer

# Fix any failing tests
# Commit and push
```

### Build Fails

If build fails:
```bash
# Test build locally
npm run build --workspace=@jql/json-sql-explorer

# Fix any errors
# Commit and push
```

## Best Practices

1. **Always test before releasing**: Run tests locally before creating a release
2. **Update CHANGELOG**: Keep CHANGELOG.md up to date with changes
3. **Use descriptive commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
4. **Review changes**: Double-check what you're publishing
5. **Test in real project**: Install and test the package in a real project before releasing

## Monitoring

After publishing:

1. Check npm: https://www.npmjs.com/package/@jql/json-sql-explorer
2. Verify version number
3. Check package contents
4. Test installation: `npm install @jql/json-sql-explorer`

## Rollback

If you published a bad version:

```bash
# Deprecate the bad version
npm deprecate @jql/json-sql-explorer@1.0.1 "This version has issues, use 1.0.2 instead"

# Then publish a fixed version
npm version patch
git push origin main --tags
```

**Note**: You cannot unpublish a version after 72 hours. Always use deprecation instead.
