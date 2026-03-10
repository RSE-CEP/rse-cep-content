# CLAUDE.md — RSE-CEP Prototype

## Project Overview

This is the RSE-CEP (Research Software Engineering Capacity Enhancement Project) content pipeline prototype. It validates the full cycle of AI-assisted content extraction from source documents → structured markdown → PR with CI validation → merge → static site deployment via GitHub Pages.

## Key Documentation

- **[docs/spec.md](docs/spec.md)** — Full project specification. The authoritative reference for all design decisions.
- **[implementation_plan.md](implementation_plan.md)** — Phased build plan with checkboxes. Update this as phases complete.
- **[docs/ai-authorship-workflow.md](docs/ai-authorship-workflow.md)** — How AI-assisted content extraction works (the Claude Code skill, prompt templates, and operator workflow).
- **[docs/github-actions-setup.md](docs/github-actions-setup.md)** — How to configure and deploy GitHub Actions workflows and repo settings.
- **[docs/validation-script.md](docs/validation-script.md)** — How the validation script works and how to run it.

## Architecture

- **Framework:** Astro with content collections
- **Schema:** Zod schemas in `src/content/config.ts` — single source of truth for content validity
- **Content types:** Patterns, roadmap items, principles (markdown with YAML frontmatter)
- **Validation:** `scripts/validate.js` — used by both CI and the AI extraction skill
- **CI/CD:** GitHub Actions — PR validation (`.github/workflows/ci.yml`) and deployment (`.github/workflows/deploy.yml`)
- **AI tooling:** Claude Code skill in `tools/claude-skill.md` with prompt templates in `tools/prompt-templates/`

## Content Authoring Rules

- Content lives in `src/content/{patterns,roadmap,principles}/` as markdown files with YAML frontmatter.
- All frontmatter must conform to the Zod schema for its type. Run `npm run validate` to check.
- Source documents (interview transcripts, etc.) go in `_sources/` which is **gitignored**. Never commit source documents — they contain sensitive research participant data.
- The `source_ref` frontmatter field identifies sources by human-readable description, not file paths or URLs.
- Content enters the repo only via pull request. CI must pass before merge.

## Working with the Implementation Plan

When completing a phase in `implementation_plan.md`:

1. Mark all items as `[x]`.
2. Add `**Completed:** YYYY-MM-DD` below the phase heading.
3. Note any deviations from plan.
4. If new work was discovered, add it to a later phase or create a new one.
5. Commit the updated plan.

## Commands

```bash
npm run dev          # Start Astro dev server
npm run build        # Production build
npm run validate     # Run schema validation against all content files
```

## Git Workflow

- Work on feature branches, not `main`.
- Branch naming: `feature/{type}-{slug}` (e.g., `feature/pattern-ner-newspapers`).
- All PRs target `main`. CI runs schema validation + trial build.
- `main` branch is protected: requires passing CI checks before merge.
- Merges to `main` trigger automatic deployment to GitHub Pages.

## AI Authorship Flow

When using Claude Code to extract content from source documents:

1. Place the source document in `_sources/` (gitignored).
2. Use the Claude skill defined in `tools/claude-skill.md`.
3. The skill follows a four-stage process: classify source → extract content → elaborate gaps → write + validate.
4. Review output with `git diff`, edit for HASS context, then commit to a feature branch.
5. The skill will call `scripts/validate.js` automatically. If validation fails, it iterates.

## Important Constraints

- **Schema is the single source of truth.** The AI tooling does not maintain its own copy of field definitions — it reads from `src/content/config.ts`.
- **Extraction before elaboration.** AI-generated content must be clearly distinguished from content extracted from source material.
- **Source document sensitivity.** Raw source documents must never be committed. They stay in `_sources/` (gitignored) or on institutional Sharepoint.
