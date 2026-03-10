# RSE-CEP Content Pipeline — End-to-End Prototype Spec

**Project:** CDL Phase 2 — Research Software Engineering Capacity Enhancement Project (RSE-CEP)  
**Author:** Mat Bettinson  
**Date:** 2026-03-11  
**Status:** Draft for prototype build

---

## 1. Purpose

An end-to-end prototype of the RSE-CEP content authoring and publishing pipeline. The prototype validates the full cycle: AI-assisted extraction from source documents → structured markdown output → PR with CI validation → merge → static site build and deployment via GitHub Pages.

The prototype serves to:

- Prove the AI-assisted content extraction tool produces valid, useful output.
- Confirm the Astro content collections + Zod schema architecture works as expected.
- Shake out the GitHub Actions CI/CD pipeline (validation, build, deploy).
- Demonstrate the complete authoring-to-publication workflow to the team and stakeholders.

## 2. Design Principles

- **Single repo.** The AI extraction tooling, content, Astro site, and CI/CD configuration all live in one repository. No cross-project path dependencies.
- **Schema as single source of truth.** Zod schemas defined in the Astro content collection config are the sole specification for valid content. The AI tooling does not maintain its own copy.
- **Extraction before elaboration.** The extraction tool clearly distinguishes content mined from source material versus content proposed by the model to fill gaps.
- **Git as the review surface.** Tool output is written directly to the content collection directory. The operator reviews via `git diff`, edits in place, and commits.
- **PR-based quality gate.** All content enters via pull request. CI runs schema validation and a trial site build before merge is permitted.
- **Source document sensitivity.** Raw source documents (especially interview transcripts) are research participant data with consent obligations. They are stored in institutional Sharepoint, with ephemeral local copies used during extraction only.

## 3. Repo Structure

```
rsecep-site/                          # Astro project root
├── src/
│   └── content/
│       ├── config.ts                 # Zod schemas for all content types
│       ├── patterns/                 # Pattern markdown files
│       ├── roadmap/                  # Roadmap item markdown files
│       └── principles/               # Architectural principle markdown files
├── src/pages/                        # Astro page templates
├── scripts/
│   └── validate.js                   # Frontmatter validation script
├── tools/
│   ├── claude-skill.md               # Claude skill definition
│   └── prompt-templates/             # Per-output-type prompt templates
│       ├── pattern.md
│       ├── roadmap-item.md
│       └── principle.md
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR validation (schema + build check)
│       └── deploy.yml                # Main branch deploy to GitHub Pages
├── _sources/                         # GITIGNORED — local working copies of source docs
├── astro.config.mjs
├── package.json
├── .gitignore
└── ...
```

## 4. Output File Format

Markdown with YAML frontmatter. Example for a pattern:

```markdown
---
title: "Named Entity Recognition for Historical Newspapers"
type: pattern
category: text-processing
maturity: draft
hass_domains:
  - digital-history
  - media-studies
source_type: interview-transcript
source_ref: "Interview with J. Example, 2026-02-15"
confidence: 0.7
related_technologies:
  - spaCy
  - Hugging Face Transformers
author: mat-bettinson
last_updated: 2026-03-10
---

## Context

[Extracted/elaborated prose...]

## Problem

[Extracted/elaborated prose...]

## Solution

[Extracted/elaborated prose...]

## HASS Considerations

[Extracted/elaborated prose...]

## Examples

[Extracted/elaborated prose, potentially including code...]
```

### Frontmatter Fields (Common)

These fields appear across all content types. Type-specific fields to be defined per schema.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Human-readable title |
| `type` | enum | yes | `pattern`, `roadmap-item`, `principle` |
| `maturity` | enum | yes | `draft`, `reviewed`, `published` |
| `hass_domains` | string[] | yes | Relevant HASS disciplines |
| `source_type` | enum | yes | `interview-transcript`, `talk-transcript`, `manual-notes`, `slides`, `mixed` |
| `source_ref` | string | yes | Identifies source document (human-readable, no Sharepoint URLs) |
| `confidence` | number | no | 0–1 indicating how much was extracted vs elaborated |
| `author` | string | yes | Team member who ran extraction and reviewed |
| `last_updated` | date | yes | ISO date |

### Body Conventions

Patterns should include the following H2 sections: Context, Problem, Solution, HASS Considerations, Examples. Roadmap items and principles will have their own section conventions (TBD when schemas are finalised). Section presence should be validated with a soft warning, not a hard failure.

## 5. Validation Script

`scripts/validate.js` — a Node script that:

1. Accepts a file path as argument, or globs across a content directory.
2. Parses YAML frontmatter using `gray-matter`.
3. Validates the parsed object against the appropriate Zod schema (determined by the `type` field) imported from `src/content/config.ts`.
4. Optionally checks body structure for expected H2 sections (soft warning).
5. Returns structured output: pass/fail, field-level errors, section warnings.
6. Exits with non-zero status on validation failure (for CI use).

This script serves double duty: invoked by the AI extraction agent during authoring, and by CI on pull requests.

**Dependencies:** `gray-matter`, `zod` (already an Astro dependency), `tsx` or similar for importing from the TypeScript config.

## 6. GitHub Actions CI/CD

### 6.1 PR Validation — `.github/workflows/ci.yml`

Triggered on pull requests targeting `main`. Two sequential steps:

**Step 1 — Schema validation.** Run `scripts/validate.js` across all content files in `src/content/`. Fast, gives immediate feedback on frontmatter errors. Fails the check if any file doesn't conform to its Zod schema.

**Step 2 — Trial Astro build.** Run `astro build` to confirm the site compiles successfully. Catches problems that schema validation alone won't find: broken markdown, bad content references, template errors. Slower, but necessary.

Both steps must pass before a PR is mergeable. Use branch protection rules on `main` to enforce this.

### 6.2 Deployment — `.github/workflows/deploy.yml`

Triggered on push to `main` (i.e. after PR merge). Builds the Astro site and deploys to GitHub Pages using the `actions/deploy-pages` action with the official Astro GitHub Pages workflow:

1. Checkout repo.
2. Install dependencies.
3. Run `astro build`.
4. Upload build artifact via `actions/upload-pages-artifact`.
5. Deploy via `actions/deploy-pages`.

**Astro config note:** Set `site` and `base` in `astro.config.mjs` to match the GitHub Pages URL. If the repo is `github.com/org/rsecep-site`, the base will be `/rsecep-site/`.

### 6.3 GitHub repo settings

- Enable GitHub Pages, source set to GitHub Actions (not branch-based).
- Branch protection on `main`: require status checks to pass (both CI steps), require PR reviews (optional for prototype, recommended for production).

## 7. Claude Skill Design

The skill operates in stages:

### Stage 1 — Source Classification
Characterise the input: is it a transcript (structured by interview questions), manual notes (sparse, telegraphic), slides (fragmentary claims), or a talk transcript (narrative)? Adapt extraction strategy accordingly.

### Stage 2 — Template-Aware Extraction
Given the target output type and its expected schema/sections, extract content from the source material. For each frontmatter field and body section:
- **Populated from source:** cite where in the source the content came from.
- **Flagged as absent/thin:** explicitly mark gaps rather than silently filling them.

The skill should be disciplined here — extract, don't hallucinate.

### Stage 3 — Guided Elaboration
For gaps identified in Stage 2, propose content clearly marked as model-generated. The operator can accept, reject, or rewrite each elaboration. This is where generic technical detail gets added, which the operator then edits for HASS context.

### Stage 4 — Output and Validation
1. Write the markdown file to the appropriate content collection directory (e.g. `src/content/patterns/{slug}.md`).
2. Invoke `scripts/validate.js` against the written file.
3. If validation fails, read the errors and iterate — fix frontmatter issues and re-validate.
4. Report final status to the operator.

### Skill Tool Definitions

The skill requires two tools:

| Tool | Description |
|---|---|
| `write_file` | Write content to a specified file path in the repo |
| `validate_content` | Execute `node scripts/validate.js <path>` and return stdout/stderr |

File reading (for source documents in `_sources/`) is handled through standard file access in the agent environment.

## 8. Source Document Management

| Concern | Approach |
|---|---|
| **Canonical storage** | Institutional Sharepoint with appropriate access controls |
| **Working copies** | Pulled to local `_sources/` directory (gitignored) for extraction runs |
| **Provenance in outputs** | `source_ref` frontmatter field identifies the source document by human-readable description |
| **Sensitivity** | Interview transcripts are research participant data — never committed to the public repo |

## 9. Schema Migration Workflow

When a schema change is needed (e.g. adding a new required field):

1. A team member creates a PR that updates the Zod schema in `src/content/config.ts`.
2. CI validation will fail for all existing content files that don't satisfy the new schema.
3. Each team member updates the files they authored:
   - Pull relevant source documents from Sharepoint to local `_sources/`.
   - Run the extraction agent against existing files + source data to populate the new field.
   - The agent should clearly distinguish values mined from source data vs model-suggested values.
   - Review, edit, and push commits to the PR branch.
4. When all files pass validation, the PR is mergeable.

### Migration conventions

- **Additive changes** (new fields): use the collaborative PR workflow above, with agent-assisted re-mining of source data.
- **Transformative changes** (renames, enum changes): write a codemod script for the mechanical transformation first (single commit), then team members review their own files for correctness.
- Don't mix additive and transformative changes in a single PR.

## 10. Operator Workflow Summary

```
AUTHORING:
1.  Pull source document from Sharepoint → _sources/
2.  Run extraction tool, specifying:
      - Target type (pattern | roadmap-item | principle)
      - Source file path
      - Brief context statement ("extract NER patterns from this Trove interview")
3.  Agent: classifies source → extracts → elaborates gaps → writes file → validates → iterates
4.  Operator: git diff → review output → edit for HASS context
5.  Operator: git checkout -b feature/pattern-ner-newspapers → commit → push → open PR

REVIEW & PUBLISH:
6.  CI: schema validation (fast) → trial Astro build (thorough)
7.  Team: review PR → approve
8.  Merge to main → deploy workflow triggers → site published to GitHub Pages
```

## 11. Prototype Scope

The prototype should demonstrate the full cycle with minimal but real content. Specifically:

- [ ] Astro project initialised with content collections and Zod schemas (patterns only is fine for prototype)
- [ ] At least one pattern authored via the extraction tool from a real source document
- [ ] Validation script working locally and in CI
- [ ] GitHub Actions: PR validation workflow (schema check + build)
- [ ] GitHub Actions: deploy workflow to GitHub Pages on merge to main
- [ ] Branch protection configured on main
- [ ] Minimal site template that renders pattern content (doesn't need to be pretty, needs to work)
- [ ] End-to-end run: author pattern → PR → CI passes → merge → site updates

## 12. Open Questions / TODO

- [ ] Finalise Zod schemas for all three content types (patterns, roadmap items, principles) — do collaboratively with Peter, Junran, and James
- [ ] Define body section conventions for roadmap items and architectural principles
- [ ] Decide on type-specific frontmatter fields beyond the common set
- [ ] Evaluate Pagefind or similar for client-side search over the built site (may be out of scope for the prototype, but good to test early)
- [ ] Determine which Astro features to use for filtering/faceting content by metadata fields
- [ ] Determine if prototype repo becomes the production repo or if it's throwaway
