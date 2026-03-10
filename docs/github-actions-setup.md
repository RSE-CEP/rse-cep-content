# GitHub Actions — Setup and Deployment Guide

This document explains how the CI/CD pipeline works, how to set it up on a new repository, and what to do when things go wrong.

## Overview

The project uses two GitHub Actions workflows:

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **CI Validation** | `.github/workflows/ci.yml` | Pull requests to `main` | Validates content schemas and runs a trial Astro build |
| **Deploy** | `.github/workflows/deploy.yml` | Push to `main` (i.e., PR merge) | Builds the site and deploys to GitHub Pages |

## How the Workflows Work

### CI Validation (`ci.yml`)

Runs on every pull request targeting `main`. Two sequential steps:

1. **Schema validation** — Runs `node scripts/validate.js` against all content files in `src/content/`. This checks that every markdown file's YAML frontmatter conforms to its Zod schema. Fast (seconds). Gives immediate, specific feedback on frontmatter errors.

2. **Trial Astro build** — Runs `npx astro build` to confirm the entire site compiles. Catches problems that schema validation alone misses: broken markdown syntax, bad content references, template rendering errors. Slower (tens of seconds) but necessary.

Both steps must pass for the PR to be mergeable.

### Deployment (`deploy.yml`)

Runs when commits are pushed to `main` (typically via PR merge). Steps:

1. Checkout the repository
2. Install Node.js and project dependencies
3. Run `npx astro build` to produce the static site in `dist/`
4. Upload the `dist/` directory as a GitHub Pages artifact (via `actions/upload-pages-artifact`)
5. Deploy the artifact to GitHub Pages (via `actions/deploy-pages`)

The site is then live at `https://{org}.github.io/{repo-name}/`.

## Initial Setup — Repository Configuration

These steps are performed once when setting up the repository on GitHub.

### 1. Enable GitHub Pages

1. Go to the repository on GitHub → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Save

This tells GitHub to expect deployments from a workflow rather than a static branch.

### 2. Configure Branch Protection

1. Go to **Settings** → **Branches** → **Add branch protection rule**
2. Branch name pattern: `main`
3. Enable:
   - **Require a pull request before merging** (optional for prototype, recommended for production)
   - **Require status checks to pass before merging**
   - Under status checks, search for and add:
     - `validate` (the schema validation job name from `ci.yml`)
     - `build` (the trial build job name from `ci.yml`)
4. Save

This prevents direct pushes to `main` and ensures all content passes validation before merge.

### 3. Set Repository Permissions for Actions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests** (if needed)
4. Save

The deploy workflow needs write permissions to publish to GitHub Pages.

### 4. Verify Astro Configuration

In `astro.config.mjs`, ensure `site` and `base` are set correctly:

```javascript
export default defineConfig({
  site: 'https://{org}.github.io',
  base: '/{repo-name}/',
  // ... other config
});
```

Replace `{org}` with the GitHub organisation and `{repo-name}` with the repository name.

## Deploying Workflow Changes

The workflow files (`.github/workflows/*.yml`) are versioned in the repository like any other code. To update them:

1. Edit the workflow YAML file(s) locally
2. Commit and push to a feature branch
3. Open a PR — note that changes to `ci.yml` take effect on the PR itself (the updated workflow runs against the PR that contains it)
4. Merge to `main`

**Important:** Changes to `deploy.yml` only take effect after merging to `main`, since the deploy workflow is triggered by pushes to `main`.

### Testing Workflow Changes

- **CI workflow changes:** Open a PR with the updated `ci.yml`. The PR will run the new version of the workflow, so you can see if it works before merging.
- **Deploy workflow changes:** These are harder to test in isolation. Options:
  - Create a temporary workflow that triggers on a different branch for testing
  - Use [act](https://github.com/nektos/act) to run workflows locally (limited GitHub Pages support, but good for catching YAML syntax errors)
  - Merge and monitor — for simple changes, just merge and watch the Actions tab

## Workflow File Reference

### ci.yml — Expected Structure

```yaml
name: CI Validation
on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run validate

  build:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx astro build
```

### deploy.yml — Expected Structure

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx astro build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Troubleshooting

| Problem | Solution |
|---|---|
| CI validation passes locally but fails in Actions | Check Node.js version matches. Check that `npm ci` installs the same dependencies (ensure `package-lock.json` is committed). |
| Deploy workflow runs but site shows 404 | Verify `base` in `astro.config.mjs` matches the repo name. Verify GitHub Pages source is set to "GitHub Actions". |
| Status checks don't appear in branch protection settings | The workflow must have run at least once for its job names to appear in the status check list. Open a test PR first. |
| `actions/deploy-pages` fails with permission error | Check repository Settings → Actions → General → Workflow permissions are set to "Read and write". |
| Workflow file has YAML syntax errors | Use a YAML linter locally before committing. VS Code with the YAML extension catches most issues. |
