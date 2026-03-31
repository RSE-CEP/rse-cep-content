# Git Workflow for Pattern Content

This document describes the Git workflow used in the RSE-CEP content pipeline. The AI commands (`/export`, `/publish`) reference steps here so operators can follow along.

## The Flow

```
master ──→ feature branch ──→ commit(s) ──→ push ──→ PR ──→ merge ──→ master
```

| Step | What happens | Who/what does it |
|------|-------------|-----------------|
| 1. Start on master | Ensure your local master is up to date | Operator |
| 2. Create feature branch | Branch from master (e.g. `feature/pattern-{slug}`) | `/export` (automatic) |
| 3. Commit work | Export clean drafts, publish patterns | `/export`, `/publish` |
| 4. Push and open PR | Push the feature branch and create a pull request | Operator (or Claude) |
| 5. PR review and merge | CI runs, reviewer approves, PR is merged on GitHub | GitHub |
| 6. Return to master | Switch back and pull to stay in sync | Operator |

## Step-by-step

### Step 1 — Start on master

Before starting new work, make sure you're on master and up to date:

```bash
git checkout master
git pull
```

If you're on a leftover feature branch from previous work, switch to master first. Old feature branches can be deleted after their PR is merged.

### Step 2 — Create a feature branch

The `/export` command creates a feature branch automatically if you're on master. Branch names follow the convention `feature/pattern-{slug}`.

If you need to create one manually:

```bash
git checkout -b feature/pattern-{slug}
```

### Step 3 — Commit work

The `/export` and `/publish` commands offer to commit after completing their work. You can also commit manually. Each commit should be a coherent unit — one exported draft, one published pattern, etc.

### Step 4 — Push and open a PR

Push your feature branch and create a pull request:

```bash
git push -u origin feature/pattern-{slug}
```

Then open a PR on GitHub (or ask Claude to do it). CI will run validation and a test build.

### Step 5 — PR review and merge

Once CI passes and the PR is reviewed, merge it on GitHub. Use the default merge strategy (merge commit).

### Step 6 — Return to master

After the PR is merged (or if you're done working on the branch for now), switch back to master:

```bash
git checkout master
git pull
```

This keeps your local master in sync with the remote and ensures your next feature branch starts from the latest state. **Staying on a stale feature branch is the most common cause of merge conflicts** — get into the habit of returning to master when you're done.

## Tips

- **One pattern per branch** is the typical workflow. If you're exporting and publishing in the same session, both commits can go on the same branch.
- **Don't commit directly to master.** The `/export` and `/publish` commands enforce this with a branch gate.
- **Delete merged branches** when you're done with them. GitHub offers a button for this after merging a PR, and locally: `git branch -d feature/pattern-{slug}`.
- **If you get a merge conflict**, it usually means master moved while you were working. The simplest fix is often to merge master into your branch: `git merge master`. Ask Claude for help if needed.
