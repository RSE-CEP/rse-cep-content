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
- Support incremental pattern discovery via proto-patterns — lightweight evidence sketches accumulated across multiple source documents before committing to a full pattern draft.

## 2. Design Principles

- **Single repo.** The AI extraction tooling, content, Astro site, and CI/CD configuration all live in one repository. No cross-project path dependencies.
- **Schema as single source of truth.** Zod schemas defined in the Astro content collection config are the sole specification for valid content. The AI tooling does not maintain its own copy.
- **Extraction before elaboration.** The extraction tool clearly distinguishes content mined from source material versus content proposed by the model to fill gaps.
- **Git as the review surface.** Tool output is written to the content collection directory on a feature branch. The operator reviews via `git diff`, edits in place, and commits. Content commands (`/draft`, `/publish`) enforce a branch gate — they will not proceed on `master`.
- **PR-based quality gate.** All content enters via pull request. CI runs schema validation and a trial site build before merge is permitted. Direct commits to `master` are not part of the workflow.
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
│   ├── validate.js                   # Frontmatter validation script
│   └── check-draft.js                # Annotation scanner for draft files
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
├── drafts/
│   ├── pattern-index.md             # Published pattern index (agent-maintained, for /draft)
│   └── patterns/                    # Clean pattern drafts (annotations stripped, ready for PR)
├── _local/                           # GITIGNORED — user-local working files
│   ├── protopatterns/               # Proto-pattern evidence files + index.md
│   └── drafts/                      # Annotated drafts (with ptr: refs to _sources/)
├── _sources/                         # GITIGNORED — local working copies of source docs
├── astro.config.mjs
├── package.json
├── .gitignore
└── ...
```

## 4. Output File Format

Markdown with YAML frontmatter. The pattern template (`docs/patterns/2 - Pattern_Template.md`) is the authoritative reference for pattern structure. YAML frontmatter captures key queryable fields for Astro content collections; the full template structure lives in the markdown body.

Example for a pattern:

```markdown
---
title: "Named Entity Recognition for Historical Newspapers"
pattern_id: I-012
pattern_type: implementation
alternative_names:
  - "Historical NER"
  - "Newspaper Entity Extraction"
keywords:
  - named-entity-recognition
  - digital-history
  - text-mining
hass_domains:
  - digital-history
  - media-studies
version: "1.0.0"
author: mat-bettinson
last_updated: 2026-03-10
source_type: interview-transcript
source_ref: "Interview with J. Example, 2026-02-15"
---

## Intent

[One or two sentences describing the core purpose...]

## Context

### When This Pattern Applies
[Extracted/elaborated prose...]

### When This Pattern Does NOT Apply
[Extracted/elaborated prose...]

### Prerequisites
[Extracted/elaborated prose...]

## Issues

### Issue 1: [Name]
[Extracted/elaborated prose...]

## Solution

### Core Idea
[Extracted/elaborated prose...]

### Key Principles
[Extracted/elaborated prose...]

## Implementation Examples
[Extracted/elaborated prose...]

## Context-Specific Guidance

### For HASS Research
[Extracted/elaborated prose...]

### For Indigenous Research
[Extracted/elaborated prose...]

## Consequences
[Extracted/elaborated prose...]

## Known Uses
[Extracted/elaborated prose...]

## Related Patterns
[Extracted/elaborated prose...]
```

### Frontmatter Fields (Common)

These fields appear across all content types. Type-specific fields are defined per schema.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Human-readable title |
| `hass_domains` | string[] | yes | Relevant HASS disciplines |
| `author` | string | yes | Team member who ran extraction and reviewed |
| `last_updated` | date | yes | ISO date |
| `source_type` | enum | no | `interview-transcript`, `talk-transcript`, `manual-notes`, `slides`, `mixed` |
| `source_ref` | string | no | Identifies source document (human-readable, no Sharepoint URLs) |

Note: `source_type` and `source_ref` are extraction-pipeline provenance fields, not pattern metadata. They track how the content was produced and are populated by the AI extraction tool.

### Pattern-Specific Frontmatter Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `pattern_id` | string | yes | Typed identifier (e.g. `I-001`, `A-001`, `D-001`). Prefix encodes type: I=implementation, A=architectural, D=design. See `docs/pattern_typology.md`. |
| `pattern_type` | enum | yes | `implementation`, `architectural`, or `design`. Must match `pattern_id` prefix. |
| `alternative_names` | string[] | no | Other terms used in the community |
| `keywords` | string[] | yes | Discovery tags (broader than `hass_domains`) |
| `version` | string | no | Semver (e.g. `1.0.0`) |

### Body Conventions

Patterns follow the structure defined in the pattern template (`docs/patterns/2 - Pattern_Template.md`). The essential H2 sections are: Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses, Related Patterns. Additional sections (Motivating Example, Common Variations, Pitfalls, Resources, Validation Checklist, Citation, Acknowledgments, Key References) are encouraged but optional.

Roadmap items and principles will have their own section conventions (TBD when schemas are finalised). Section presence should be validated with a soft warning, not a hard failure.

### Draft Annotation Syntax

Draft pattern files in `drafts/patterns/` use inline annotations to track provenance. All annotations must be removed before publication.

**EXTRACTED** — Content sourced from an input document. Uses a pointer to the text rendition rather than embedded quotes:

```
[EXTRACTED | source: "identifier" | ptr: "_sources/filename.txt:startline:endline" | basis: "short description"]
```

| Field | Description |
|-------|-------------|
| `source` | Human-readable source identifier (safe to commit — no participant names, no identifying file paths) |
| `ptr` | Pointer to text rendition: repo-relative `.txt` file path, colon-separated start and end line numbers (1-indexed, inclusive) |
| `basis` | Short description of extracted content (~100 chars max, not a quote). Summarises what was extracted so the reviewer knows what to verify. |

**ELABORATED** — Content generated by the AI to fill gaps:

```
[ELABORATED | basis: "reason for elaboration"]
```

Annotation rules:
- EXTRACTED annotations must never contain quoted or paraphrased source text — the `basis` field is a summary only
- Source content is accessible via the `ptr` field (resolved by the review tool or manual inspection)
- A `.txt` text rendition of the source must exist in `_sources/` before pointers can be written
- `scripts/check-draft.js` detects remaining annotations and lints `basis` fields for potential embedded quotes

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

Triggered on pull requests targeting `master`. Two sequential steps:

**Step 1 — Schema validation.** Run `scripts/validate.js` across all content files in `src/content/`. Fast, gives immediate feedback on frontmatter errors. Fails the check if any file doesn't conform to its Zod schema.

**Step 2 — Trial Astro build.** Run `astro build` to confirm the site compiles successfully. Catches problems that schema validation alone won't find: broken markdown, bad content references, template errors. Slower, but necessary.

Both steps must pass before a PR is mergeable. Use branch protection rules on `master` to enforce this.

### 6.2 Deployment — `.github/workflows/deploy.yml`

Triggered on push to `master` (i.e. after PR merge). Builds the Astro site and deploys to GitHub Pages using the `actions/deploy-pages` action with the official Astro GitHub Pages workflow:

1. Checkout repo.
2. Install dependencies.
3. Run `astro build`.
4. Upload build artifact via `actions/upload-pages-artifact`.
5. Deploy via `actions/deploy-pages`.

**Astro config note:** Set `site` and `base` in `astro.config.mjs` to match the GitHub Pages URL. If the repo is `github.com/org/rsecep-site`, the base will be `/rsecep-site/`.

### 6.3 GitHub repo settings

- Enable GitHub Pages, source set to GitHub Actions (not branch-based).
- Branch protection on `master`: require status checks to pass (both CI steps), require PR reviews (optional for prototype, recommended for production).

## 7. Claude Commands

Four slash commands implement the authoring pipeline:

### `/extract` — Proto-Pattern Mining

Analyses a source document to identify candidate patterns and accumulate evidence in lightweight proto-pattern files (`_local/protopatterns/`, gitignored). Four stages:

1. **Source Analysis** — Read source, identify candidate patterns with working names, descriptions, exemplifying projects, and key evidence.
2. **Index Matching** — Semantic match candidates against existing proto-patterns in `_local/protopatterns/index.md`. Present match table for operator confirmation.
3. **Create or Update** — For matches: add projects and evidence to existing proto-pattern. For new: create file and index entry.
4. **Write and Report** — Write all files, report summary (created N, updated N, total in index).

Proto-patterns are freeform markdown with projects, sources table, and dated notes sections. They are not structured pattern drafts.

### `/draft` — Full Pattern Drafting

The 5-stage extraction flow that produces a full structured pattern draft. Accepts two input modes:

- **Source document** (from `_sources/`) — direct single-source drafting (original workflow)
- **Proto-pattern** (from `_local/protopatterns/`) — uses accumulated multi-source evidence as input

Stages: classify source → template-aware extraction → guided elaboration → output with annotations and validation → export gate. Annotated drafts are written to `_local/drafts/` (gitignored) with inline `[EXTRACTED]` and `[ELABORATED]` annotations. EXTRACTED annotations use pointer-based references to text renditions in `_sources/` (see §4 Draft Annotation Syntax) — no source text is embedded in draft files. The export gate strips annotations and copies the clean draft to `drafts/patterns/` for commit.

**Related pattern proposals:** During Stage 3 (guided elaboration), the `/draft` command reads the published pattern index (`drafts/pattern-index.md`) and proposes related patterns for the Related Patterns section (section 9 of the template). The index contains agent-written summaries alongside structured metadata (ID, type, keywords, domains), enabling semantic matching. Proposed relationships are presented to the operator for confirmation before inclusion.

When drafting from a proto-pattern, the proto-pattern entry is removed from the index and the file deleted after successful drafting.

### `/publish` — Publication Gate

Validates a draft in `drafts/patterns/` and moves it to `src/content/patterns/`. Checks: schema validation, annotation removal, section completeness, URL verification, quality review. On successful publication, appends an entry to `drafts/pattern-index.md` with the pattern's metadata and a one-line agent-written summary.

### `/update` — Published Pattern Editing

Interactive editing of published patterns in `src/content/patterns/`. Accepts a file path or pattern ID (resolved via `drafts/pattern-index.md`). The pattern remains published throughout — no return to draft status.

Flow:

1. **Load** — Read the pattern, schema, and pattern index entry into context.
2. **Interactive editing** — Operator describes changes. Edits applied in-place in `src/content/patterns/`. Two modes of change:
   - **Operator-directed edits** (fix this typo, update this URL, change this date, reword this sentence to say X) — no annotations. The operator is the author of the change.
   - **New substantive content** (add a Known Use, expand Context to cover a new topic, write a new Implementation Example) — the model annotates generated content with `[ELABORATED | basis: "..."]`, same syntax as `/draft`. The rule is: if the model is generating narrative content that wasn't explicitly dictated by the operator, it must annotate. **When in doubt, annotate.** A false positive (unnecessary annotation) costs the operator one line deletion. A false negative (unverified AI content in production) defeats the purpose of the annotation system.
3. **Exit gate** — On operator signal, run validation checks:
   - Schema validation
   - Section completeness
   - Annotation check via `scripts/check-draft.js` — if annotations remain, the operator must review and remove them before finishing, same as the `/publish` workflow
   - URL verification on new or changed URLs only (diff-aware)
4. **Index sync** — If title, keywords, domains, type, or the pattern's essence changed, update the corresponding row in `drafts/pattern-index.md` (including summary rewrite if warranted).
5. **Cross-reference maintenance** — If Related Patterns changed, update back-references in affected published patterns.
6. **Commit offer** — Feature branch and commit for PR review.

Key design decisions:
- **Annotations for generated content only.** Unlike `/draft` (where everything is annotated), `/update` only annotates model-generated substantive content. Operator-directed edits are not annotated — the operator is the author. This keeps the annotation overhead proportional to the AI contribution.
- **No quality review stage.** The pattern already passed quality review at publication. The operator is making targeted changes.
- **PR/CI remains the real gate.** `/update` provides convenience and prevents supporting data (index, cross-references) from silently drifting.

## 8. Source Document Management

| Concern | Approach |
|---|---|
| **Canonical storage** | Institutional Sharepoint with appropriate access controls |
| **Working copies** | Pulled to local `_sources/` directory (gitignored) for extraction runs |
| **Provenance in outputs** | `source_ref` and `source_type` frontmatter fields identify the source document. These are pipeline provenance, not pattern metadata |
| **Sensitivity** | Interview transcripts are research participant data — never committed to the public repo |

### Text Renditions

Source documents that are not already plain text (`.docx`, `.pdf`, etc.) must be rendered to a `.txt` file before EXTRACTED annotation pointers can be written. Convention:

- Rendition lives in `_sources/` alongside the original (both gitignored)
- Same filename stem, `.txt` extension: `some-talk.pdf` → `some-talk.txt`
- The `/draft` command generates the rendition using available tools as part of the drafting run, before writing annotations
- If a `.txt` rendition already exists, it is used as-is

### Anonymised Source Filenames

**Participant interview transcripts must use anonymised filenames** before being placed in `_sources/`. Use date-based or sequential naming:

- `interview-2026-03-15-a.txt`
- `interview-2026-03-15-b.txt`

No participant names, roles, or institutions in filenames. This is a process convention enforced by operator discipline — it cannot be automated.

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
PATTERN DISCOVERY (incremental, recommended):
1.  Pull source document from Sharepoint → _sources/
2.  /extract — mine proto-patterns from the source
      Agent: analyses source → identifies candidates → matches index
      Output: _local/protopatterns/ (gitignored)
3.  Repeat steps 1-2 with additional sources to accumulate evidence
4.  When a proto-pattern has sufficient evidence:
      /draft _local/protopatterns/slug.md — create full pattern draft
      Agent: branch gate → 4-stage extraction → annotated draft in _local/drafts/
5.  Export: verify annotations → strip markers → copy to drafts/patterns/
6.  /publish — validate and move to production (branch gate enforced)

DIRECT DRAFTING (single source, still supported):
1.  Pull source document from Sharepoint → _sources/
2.  /draft _sources/document.docx — 5-stage extraction to full draft
      Agent: branch gate → 4-stage extraction → annotated draft in _local/drafts/
3.  Export: verify annotations → strip markers → copy to drafts/patterns/
4.  /publish — validate and move to production (branch gate enforced)

POST-PUBLICATION MAINTENANCE:
      /update {path-or-ID} — interactive editing of published patterns
      Agent: loads pattern → applies edits (selective annotation) → exit gate → index sync → cross-ref maintenance

REVIEW & DEPLOY (feature branch already exists from /draft):
5.  Operator: commit → push → open PR
6.  CI: schema validation (fast) → trial Astro build (thorough)
7.  Team: review PR → approve
8.  Merge to master → deploy workflow triggers → site published to GitHub Pages

NOTE: v1 assumes single-user workflow — the person who extracts is the person who
drafts. Multi-user source sharing is explicitly deferred.
```

## 11. Open Questions / Future Considerations

- **Roadmap and principles content types** — Zod schemas and body section conventions for roadmap items and architectural principles are deferred (out of scope for the prototype). To be finalised collaboratively with Peter, Junran, and James when that content type is needed.
- **Client-side search** — Evaluate Pagefind or similar for full-text search over the built site.
- **Filtering and faceting** — Determine which Astro features to use for filtering/faceting patterns by metadata fields at scale.
- **Prototype → production** — Decide whether this repo becomes the production repo or is throwaway.
- **Batch link-rot checker** — A script to scan all published patterns for broken URLs. The per-pattern URL check during `/publish` is agent-driven (and benefits from agent judgement, e.g. DOIs that resolve to unexpected destinations), but a periodic batch check across all published content would catch links that break after publication.
