# GitHub Actions — Setup and Deployment Guide

This document explains how the CI/CD pipeline works, how to set it up on a new repository, and what to do when things go wrong.

## Overview

The project uses two GitHub Actions workflows:

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **CI Validation** | `.github/workflows/ci.yml` | Pull requests to `master` | Validates content schemas and runs a trial Astro build |
| **Deploy** | `.github/workflows/deploy.yml` | Push to `master` (i.e., PR merge) | Builds the site and deploys to GitHub Pages |

## How the Workflows Work

### CI Validation (`ci.yml`)

Runs on every pull request targeting `master`. Two sequential jobs:

1. **Schema validation** (`validate` job) — Runs `node scripts/validate.js` against all content files in `src/content/`. This checks that every markdown file's YAML frontmatter conforms to its Zod schema. Fast (seconds). Gives immediate, specific feedback on frontmatter errors.

2. **Trial Astro build** (`build` job) — Runs `npx astro build` to confirm the entire site compiles. Catches problems that schema validation alone misses: broken markdown syntax, bad content references, template rendering errors. Slower (tens of seconds) but necessary. Only runs if `validate` passes.

Both jobs must pass for the PR to be mergeable.

### Deployment (`deploy.yml`)

Runs when commits are pushed to `master` (typically via PR merge). Steps:

1. Checkout the repository
2. Install Node.js and project dependencies
3. Run `npx astro build` to produce the static site in `dist/`
4. Upload the `dist/` directory as a GitHub Pages artifact (via `actions/upload-pages-artifact`)
5. Deploy the artifact to GitHub Pages (via `actions/deploy-pages`)

The site is then live at `https://{org}.github.io/{repo-name}/`.

## Initial Setup — Repository Configuration

These steps are performed once when setting up the repository on GitHub. Do them in order.

### 1. Enable GitHub Pages

1. Go to the repository on GitHub → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Save

This tells GitHub to expect deployments from a workflow rather than a static branch.

### 2. Set Repository Permissions for Actions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests** (if needed)
4. Save

The deploy workflow needs write permissions to publish to GitHub Pages.

### 3. Verify Astro Configuration

In `astro.config.mjs`, ensure `site` and `base` are set correctly:

```javascript
export default defineConfig({
  site: 'https://{org}.github.io',
  base: '/{repo-name}/',
  // ... other config
});
```

Replace `{org}` with the GitHub organisation and `{repo-name}` with the repository name.

### 4. Push the Workflows and Open a Test PR

**Important:** Branch protection (step 5) requires the CI workflow to have run at least once — GitHub doesn't know about the status check names (`Schema Validation`, `Trial Build`) until it has seen them. So you must do this step first:

1. Push the workflow files to `master` (either directly or via a PR)
2. Create a feature branch with a small change (e.g., edit a content file)
3. Open a pull request targeting `master`
4. Wait for the CI workflow to run — watch the **Actions** tab
5. Verify both checks (`Schema Validation` and `Trial Build`) appear and pass

Once the CI has run at least once, the check names will be available for branch protection in the next step.

### 5. Configure Branch Protection

GitHub offers two options: **Rulesets** (newer) and **Classic branch protection rules**. Either works. Use whichever you see in your repo settings.

#### Option A: Rulesets (newer GitHub UI)

1. Go to **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**
2. Give it a name (e.g., "Protect master")
3. Set **Enforcement status** to **Active**
4. Under **Target branches**, click **Add target** → **Include by pattern** → enter `master`
5. Under **Branch rules**, enable:
   - **Require a pull request before merging** (optional for prototype, recommended for production)
   - **Require status checks to pass** — then click **Add checks** and search for:
     - `Schema Validation` (this is the `name:` field from the validate job in `ci.yml`)
     - `Trial Build` (this is the `name:` field from the build job in `ci.yml`)
   - If the checks don't appear in the search, the CI workflow hasn't run yet — go back to step 4
6. Click **Create**

#### Option B: Classic branch protection rules

1. Go to **Settings** → **Branches** → **Add classic branch protection rule**
2. Branch name pattern: `master`
3. Enable:
   - **Require a pull request before merging** (optional for prototype, recommended for production)
   - **Require status checks to pass before merging**
   - Under status checks, search for and add:
     - `Schema Validation`
     - `Trial Build`
   - If the checks don't appear in the search, the CI workflow hasn't run yet — go back to step 4
4. Save

#### Why can't I find the status checks?

The status check names (`Schema Validation`, `Trial Build`) only appear in GitHub's search dropdown **after the CI workflow has run at least once** on the repository. This is a GitHub limitation — it doesn't know what checks a workflow produces until it has actually executed.

If you can't find them:
1. Make sure the workflow files are committed and pushed
2. Open a test PR targeting `master`
3. Wait for the CI to run (check the **Actions** tab)
4. Then come back to branch protection settings and try searching again

The names to search for match the `name:` field in each job in `ci.yml`:
- Job key `validate` has `name: Schema Validation` → search for **Schema Validation**
- Job key `build` has `name: Trial Build` → search for **Trial Build**

## Deploying Workflow Changes

The workflow files (`.github/workflows/*.yml`) are versioned in the repository like any other code. To update them:

1. Edit the workflow YAML file(s) locally
2. Commit and push to a feature branch
3. Open a PR — note that changes to `ci.yml` take effect on the PR itself (the updated workflow runs against the PR that contains it)
4. Merge to `master`

**Important:** Changes to `deploy.yml` only take effect after merging to `master`, since the deploy workflow is triggered by pushes to `master`.

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
    branches: [master]

jobs:
  validate:
    name: Schema Validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run validate

  build:
    name: Trial Build
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
    branches: [master]

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

## Migrating to a New Organisation

If the repository is transferred to a different GitHub organisation (via Settings → Transfer), the workflow files and code move with the repo, but several GitHub-side settings and one code change need to be redone. Follow these steps in order.

### 1. Update `astro.config.mjs`

The `site` and `base` fields in `astro.config.mjs` control the URL prefix for all generated links. GitHub Pages for organisation repos serves at `https://{org}.github.io/{repo-name}/`, so these values must match the new location:

```javascript
export default defineConfig({
  site: 'https://{new-org}.github.io',
  base: '/{repo-name}/',
});
```

- **`site`** — the root domain for the GitHub Pages site, derived from the org name.
- **`base`** — the path prefix, derived from the repository name. Every generated link and asset path includes this prefix. If the repo name stays the same after transfer, `base` stays the same. If the repo is renamed, update `base` to match.

Commit this change before proceeding — the deploy workflow will use it on first run.

### 2. Re-enable GitHub Pages

GitHub Pages settings do not transfer. On the new org's copy of the repo:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### 3. Set Workflow Permissions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Save

### 4. Bootstrap CI and Reconfigure Branch Protection

Branch protection rules / rulesets do not transfer, and GitHub requires CI to have run at least once before its check names become searchable. Follow the same bootstrapping sequence as initial setup:

1. Open a test PR targeting `master` with a trivial change
2. Wait for CI to run — verify `Schema Validation` and `Trial Build` both appear and pass in the Actions tab
3. Then configure branch protection (see "Configure Branch Protection" above) — the check names will now appear in the search

### 5. Repoint Local Clones

Anyone with a local clone needs to update their remote:

```bash
git remote set-url origin https://github.com/{new-org}/{repo-name}.git
```

GitHub provides automatic redirects from the old URL for a period after transfer, but it's best to update promptly.

## Troubleshooting

| Problem | Solution |
|---|---|
| CI validation passes locally but fails in Actions | Check Node.js version matches (must be 22+). Check that `npm ci` installs the same dependencies (ensure `package-lock.json` is committed). |
| Deploy workflow runs but site shows 404 | Verify `base` in `astro.config.mjs` matches the repo name. Verify GitHub Pages source is set to "GitHub Actions". |
| Status checks don't appear in branch protection settings | The workflow must have run at least once for its job names to appear in the search. Open a test PR first, wait for CI to complete, then configure branch protection. See "Why can't I find the status checks?" above. |
| `actions/deploy-pages` fails with permission error | Check repository Settings → Actions → General → Workflow permissions are set to "Read and write". |
| Workflow file has YAML syntax errors | Use a YAML linter locally before committing. VS Code with the YAML extension catches most issues. |
| Deploy workflow doesn't trigger after merge | Check that `deploy.yml` triggers on `push: branches: [master]` — must match your actual default branch name. |
