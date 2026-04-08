# RSE-CEP Prototype — Implementation Plan

**Reference:** [spec.md](./spec.md)
**Status key:** `[ ]` not started · `[~]` in progress · `[x]` complete

---

## Phase 1 — Project Scaffolding

**Completed:** 2026-03-11

Set up the Astro project, content collection schemas, and directory structure.

- [x] Initialise Astro project (`npm create astro@latest`)
- [x] Configure `astro.config.mjs` with `site` and `base` for GitHub Pages
- [x] Design Zod schema for patterns based on `docs/patterns/2 - Pattern_Template.md` (see design notes below)
- [x] Create Zod schemas in `src/content.config.ts` (patterns first; roadmap and principles out of prototype scope)
- [x] Create content collection directory: `src/content/patterns/`
- [x] Add placeholder pattern file to validate schema wiring
- [x] Set up `.gitignore` (include `_sources/`, `node_modules/`, `dist/`)
- [x] Install dev dependencies (`gray-matter`, `tsx`)
- [x] Create `_sources/` directory with a `.gitkeep` (directory exists but contents ignored)

### Deviations

- **Config file location:** Astro 6 uses `src/content.config.ts` (project root of `src/`), not `src/content/config.ts`. Updated references accordingly.
- **Zod import:** Astro 6 provides Zod via `astro/zod` — no separate `zod` install needed at runtime, but kept as devDependency for the validation script (Phase 2).
- **Astro version:** Scaffolded with Astro v6.0.2 (latest at time of build).

### Design Note: Pattern Schema

The spec (§4) now reflects the pattern template structure. Key design decisions:

- **Frontmatter for Astro, body for template structure.** Queryable fields (`title`, `pattern_id`, `keywords`, `hass_domains`, etc.) live in YAML frontmatter for Astro content collections. The full pattern template structure (Intent, Context, Issues, Solution, etc.) lives in the markdown body.
- **Provenance fields are separate from pattern metadata.** `source_type` and `source_ref` are extraction-pipeline fields populated by the AI tool, not part of the pattern template itself. They are optional in the schema.
- **Body sections follow the pattern template.** Essential sections: Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses, Related Patterns. Additional sections are optional.
- **No maturity field.** Maturity judgements are out of scope for this pipeline.

**Done when:** `npm run dev` starts, placeholder pattern renders without errors.

---

## Phase 2 — Validation Script

**Completed:** 2026-03-11

Build the schema validation script used by both CI and the AI extraction agent.

- [x] Create `scripts/validate.js` per spec §5
- [x] Accept file path argument or glob across `src/content/`
- [x] Parse YAML frontmatter with `gray-matter`
- [x] Validate against Zod schema (pattern type)
- [x] Soft-warn on missing body sections per pattern template conventions (Intent, Context, Issues, Solution, etc.)
- [x] Structured output: pass/fail, field-level errors, section warnings
- [x] Non-zero exit code on validation failure
- [x] Add `validate` script to `package.json`
- [x] Test against placeholder content (should pass) and a deliberately broken file (should fail)

### Deviations

- **Schema duplication:** The validation script defines its own copy of the Zod pattern schema using the `zod` devDependency, rather than importing from `src/content.config.ts`. Astro's config uses `astro/zod` which doesn't resolve outside Astro's build pipeline. The schemas are small and unlikely to diverge; if they do, a shared schema module can be introduced later.
- **`validate` script already in `package.json`:** Was added during Phase 1 scaffolding (`node --import tsx scripts/validate.js`).
- **Node.js `fs/promises` glob:** Uses Node's built-in `glob` (Node 22+) for file discovery instead of a third-party glob package.

**Done when:** `npm run validate` runs cleanly against all content, catches intentional errors.

---

## Phase 3 — GitHub Actions CI/CD

**Completed:** 2026-03-11

Set up the PR validation and deployment workflows.

- [x] Create `.github/workflows/ci.yml` — PR validation
  - [x] Trigger on pull requests targeting `master`
  - [x] Step 1: Schema validation (`node scripts/validate.js`)
  - [x] Step 2: Trial Astro build (`npx astro build`)
- [x] Create `.github/workflows/deploy.yml` — GitHub Pages deployment
  - [x] Trigger on push to `master`
  - [x] Build Astro site
  - [x] Upload artifact via `actions/upload-pages-artifact`
  - [x] Deploy via `actions/deploy-pages`
- [x] Configure GitHub repo settings (see [docs/github-actions-setup.md](./docs/github-actions-setup.md)):
  - [x] Enable GitHub Pages with source = GitHub Actions
  - [x] Add branch protection on `master` requiring CI status checks
- [x] Test: open a PR with valid content → CI passes
- [x] Test: open a PR with invalid frontmatter → CI fails with clear error

### Deviations

- **Node version bumped to 22:** The workflow files use Node 22 (not 20 as shown in the original docs) because `scripts/validate.js` uses Node's built-in `fs/promises` glob, which requires Node 22+. The docs reference (`docs/github-actions-setup.md`) still shows Node 20 in its example YAML — this is now outdated.
- **Repo settings are manual steps:** The GitHub Pages source and branch protection rules must be configured manually via the GitHub UI after the workflows are pushed. These are marked as incomplete above — see `docs/github-actions-setup.md` for step-by-step instructions.
- **Testing deferred:** The PR validation tests (valid content passes, invalid content fails) can only be verified after pushing these workflows and opening test PRs. These are marked incomplete above.

**Done when:** PRs are gated by schema validation + build check; merges to main auto-deploy.

---

## Phase 4 — Claude Skill / AI Extraction Tooling

**Completed:** 2026-03-11

Build the Claude Code skill that performs AI-assisted content extraction.

- [x] Create `tools/claude-skill.md` — skill definition with four-stage extraction flow
- [x] Create prompt template `tools/prompt-templates/pattern.md` referencing the canonical pattern template (`docs/patterns/2 - Pattern_Template.md`)
- [x] Implement the four-stage extraction flow (classify → extract → elaborate → validate)
- [x] Ensure the skill populates both YAML frontmatter (for Astro) and the full body template structure
- [x] Ensure the skill invokes `scripts/validate.js` after writing output
- [x] Test with a real source document from `_sources/`
- [x] Document the skill usage in [docs/ai-authorship-workflow.md](./docs/ai-authorship-workflow.md)

### Deviations

- **No tool declarations in skill definition.** The spec (§7) proposed explicit `write_file` and `validate_content` tool declarations. Instead, the skill instructs Claude Code to use its built-in file writing and bash execution capabilities directly. This is simpler and avoids maintaining a separate tool abstraction layer.
- **Testing deferred to Phase 6.** Testing with a real source document requires a source document in `_sources/`. This will be exercised as part of Phase 6 (End-to-End Validation).
- **Stale file path references fixed.** `docs/ai-authorship-workflow.md` referenced `src/content/config.ts` (old Astro convention). Updated to `src/content.config.ts` (Astro 6). Also updated body section terminology from "Problem" to "Issues" to match project conventions.

**Done when:** Running the skill against a source document produces a valid pattern file that passes schema validation and follows the pattern template structure.

---

## Phase 5 — Minimal Site Templates

**Completed:** 2026-03-11

Create Astro page templates that render content collection items.

- [x] Create index page listing all patterns (filterable by keywords, hass_domains)
- [x] Create individual pattern page template that renders the full pattern structure
- [x] Basic layout with navigation (minimal styling — functional, not pretty)
- [x] Render pattern metadata table from frontmatter
- [x] Render the rich body structure (Intent, Context, Issues, Solution, etc.)
- [x] Verify the built site works on GitHub Pages (correct base path handling)

### Deviations

- **Client-side filtering only.** The index page uses checkbox filters with client-side JavaScript (no server-side filtering). This is appropriate for the expected small number of patterns and keeps the site fully static.
- **Global styles.** The Base layout uses `<style is:global>` so that typography and table styles apply to rendered markdown content (which lacks Astro's scoped data attributes).

**Done when:** Patterns are browsable on the deployed site with metadata and full body structure visible.

---

## Phase 6 — End-to-End Validation

Prove the full cycle works with real content.

- [x] Author at least one pattern via the extraction tool from a real source document
- [x] Create a feature branch, commit the pattern, push, open a PR
- [x] Verify CI runs and passes (schema validation + build)
- [x] Merge the PR
- [x] Verify the deploy workflow triggers and the site updates on GitHub Pages
- [x] Document any issues encountered and update this plan

**Done when:** The full cycle described in spec §10 has been exercised successfully.

---

## Phase 7 — Command Refactoring

**Completed:** 2026-03-12

Convert the Claude skill into user-invocable slash commands and establish the command-based workflow.

- [x] Create `/extract` command (`.claude/commands/extract.md`) — same 4-stage flow, conversational Git integration
- [x] Create `/publish` command stub (`.claude/commands/publish.md`) — runs validation, placeholder for Phase 9 expansion
- [x] Retire `tools/claude-skill.md` as a skill — keep as reference documentation, add archival notice
- [x] Update `docs/ai-authorship-workflow.md` — reference `/extract` and `/publish` commands
- [x] Update `CLAUDE.md` — add AI Authorship Commands section
- [x] Update `docs/implementation_plan.md` — add phases 7-9

### Deviations

- None.

**Done when:** `/extract` command follows the 4-stage flow. `/publish` stub runs validation. Documentation updated.

---

## Phase 8 — Draft Pipeline & Annotation System

**Completed:** 2026-03-12

Establish a formal draft stage with machine-parseable annotations supporting multi-source citation.

- [x] Create `drafts/patterns/` directory (committable, not gitignored)
- [x] Define annotation syntax: `[EXTRACTED | source: "..." | ref: ... | "quote"]` and `[ELABORATED | basis: "..."]`
- [x] Update `/extract` command — output to `drafts/patterns/`, use structured annotation syntax
- [x] Create `scripts/check-draft.js` — scans for annotation markers, reports count/locations, exit code 0/1
- [x] Update `scripts/validate.js` — recognise `drafts/patterns/` path, add `--publish` mode for hard-fail on missing sections
- [x] Update `docs/ai-authorship-workflow.md` — document draft review workflow and annotation syntax

### Deviations

- None.

**Done when:** Extraction outputs to `drafts/patterns/` with structured annotations. `check-draft.js` detects annotations. Validation supports draft paths.

---

## Phase 9 — Publish Command

**Completed:** 2026-03-12

Full publish gate that validates a draft is production-ready and moves it into the content collection.

- [x] Expand `/publish` command with three-check gate: schema validation, annotation check, section completeness
- [x] Add model-assisted quality review step (flags obvious issues against pattern definition guide)
- [x] Publish action: move file from `drafts/patterns/` to `src/content/patterns/`, re-validate, offer to commit
- [x] Publish failure: report which checks failed with details, do not move file

### Deviations

- None.

**Done when:** `/publish` on a draft with annotations fails and reports them. `/publish` on a clean draft passes, moves file, and validation succeeds.

---

## Phase 10 — Proto-Pattern Mining

**Completed:** 2026-03-16

Add incremental pattern discovery via proto-patterns: lightweight freeform evidence sketches that accumulate material from multiple source documents before committing to a full draft.

- [x] 10a — Create `drafts/protopatterns/` directory with `.gitkeep` and empty `index.md`
- [x] 10b — Create new `/extract` command (`.claude/commands/extract.md`) for proto-pattern mining (4-stage: analyse → match index → create/update → report)
- [x] 10c — Rename old `/extract` to `/draft` (`.claude/commands/draft.md`), add proto-pattern input mode alongside existing source document mode
- [x] 10d — Update documentation:
  - [x] `docs/spec.md` — sections 1 (purpose), 3 (repo structure), 7 (commands), 10 (workflow)
  - [x] `CLAUDE.md` — AI Authorship Commands section
  - [x] `docs/ai-authorship-workflow.md` — proto-pattern lifecycle, renamed commands, troubleshooting
  - [x] `docs/implementation_plan.md` — this phase
- [x] 10e — Verification: commands register correctly, documentation is consistent

### Deviations

- None.

**Done when:** `/extract` mines proto-patterns, `/draft` accepts both source docs and proto-patterns, `/publish` unchanged, all documentation updated.

---

## Phase 11 — Pattern Typology System

**Completed:** 2026-03-16

Introduce a three-type classification (Implementation, Architectural, Design) as a first-class property throughout the pipeline. Also fixes duplicate `RSE-HASS-002` ID on two published patterns.

- [x] 11a — Create `docs/pattern_typology.md` (type definitions, prior work, ID conventions, section guidance, classification decision guide)
- [x] 11b — Schema changes:
  - [x] `src/content.config.ts` — add `pattern_type` enum, typed `pattern_id` regex, `.refine()` cross-validation
  - [x] `scripts/validate.js` — mirror schema changes
- [x] 11c — Reclassify published patterns:
  - [x] `version-control-for-research.md` — RSE-HASS-001 → I-001 (implementation)
  - [x] `community-delegated-access-control.md` — RSE-HASS-002 → A-001 (architectural)
  - [x] `ro-crate-for-research-data-packaging.md` — RSE-HASS-002 (duplicate!) → I-002 (implementation)
  - [x] Validation passes for all 3
- [x] 11d — Update `/extract` command (type column in candidates, typed IDs, type in proto-pattern files and index)
- [x] 11e — Update `/draft` command (type confirmation step, type-aware extraction, `pattern_type` in output)
- [x] 11f — Update `/publish` command (type-content consistency check in quality review)
- [x] 11g — Update site rendering:
  - [x] `index.astro` — type filter toggle buttons, type badge on cards
  - [x] `[...slug].astro` — Pattern Type row in metadata table
- [x] 11h — Update documentation:
  - [x] `docs/spec.md` — updated frontmatter example and field table
  - [x] `docs/ai-authorship-workflow.md` — type classification step, updated stage descriptions
  - [x] `docs/patterns/1 - Pattern_Definition_Guide.md` — updated Types section, reference to typology doc
  - [x] `docs/patterns/2 - Pattern_Template.md` — added Pattern Type to metadata table, updated example ID
  - [x] `CLAUDE.md` — typology in Architecture section, added typology doc to Documentation
  - [x] `docs/implementation_plan.md` — this phase

### Deviations

- None.

**Done when:** All 3 patterns validate with new schema, site builds with type display, commands reference typology throughout.

---

## Phase 12 — Published Pattern Index & Related Pattern Proposals

**Completed:** 2026-03-17

Introduce an agent-maintained index of published patterns (`drafts/pattern-index.md`) and use it during `/draft` to propose related patterns for section 9 (Related Patterns) of the template. The index is a markdown table — same approach as the proto-pattern index — with an agent-written summary column for semantic matching.

- [x] 12a — Create `drafts/pattern-index.md`:
  - Markdown table with columns: ID, Type, Title, Keywords, HASS Domains, Summary
  - Summary is a one-line agent-written description (not mechanically extracted) — compact enough for the `/draft` agent to reason about relationships
  - Seed with entries for any currently published patterns (if none, create with header row only)
- [x] 12b — Update `/publish` command (`.claude/commands/publish.md`):
  - After successful publication, append a row to `drafts/pattern-index.md`
  - Agent writes a concise one-line summary capturing the pattern's essence for relationship matching
  - If `drafts/pattern-index.md` doesn't exist, create it with the header row first
- [x] 12c — Update `/draft` command (`.claude/commands/draft.md`):
  - In Stage 3 (Guided Elaboration), read `drafts/pattern-index.md`
  - Match the draft pattern against published patterns using the index (shared keywords, domains, type, and semantic relevance of summaries)
  - Present a table of proposed related patterns with relationship type (Works Well With / Alternative Approaches / Typical Sequence) and rationale
  - Operator confirms, rejects, or edits proposals before inclusion in the Related Patterns section
  - If `drafts/pattern-index.md` is missing or empty, skip gracefully with a note
- [x] 12d — Update documentation:
  - [x] `docs/spec.md` — repo structure, `/draft` and `/publish` command descriptions
  - [x] `CLAUDE.md` — note index in Architecture section, updated `/draft` and `/publish` descriptions
  - [x] `docs/ai-authorship-workflow.md` — document related pattern proposal step in draft workflow, index update on publish
  - [x] `docs/implementation_plan.md` — this phase
- [x] 12e — Manual testing:
  - Publish a pattern via `/publish`, verify row appended to `drafts/pattern-index.md` with good summary
  - Run `/draft` with published patterns present, verify related pattern proposals appear
  - Run `/draft` with no published patterns, verify graceful skip

### Deviations

- **No published patterns to seed.** The published patterns directory (`src/content/patterns/`) is currently empty — previously published patterns were removed during the Phase 11 rework. The index was created with header row only.
- **Manual testing deferred.** 12e requires running `/publish` and `/draft` interactively, so it is left unchecked for the operator to verify.

**Done when:** `/publish` appends to the pattern index on publication. `/draft` reads the index and proposes related patterns during elaboration. Index is committed to repo.

---

## Phase 13 — Published Pattern Update Command

**Completed:** 2026-03-18

Add an `/update` command for interactive editing of published patterns, with validation checks and index/cross-reference maintenance.

- [x] 13a — Create `/update` command (`.claude/commands/update.md`):
  - Accept file path or pattern ID (resolve ID via `drafts/pattern-index.md`)
  - Load pattern, schema, and index entry into context
  - Interactive editing with selective annotation:
    - Operator-directed edits (typos, URL fixes, rewordings dictated by operator) — no annotations
    - Model-generated substantive content (new Known Uses, expanded sections, new narrative) — must use `[ELABORATED | basis: "..."]` annotations
    - Rule: when in doubt, annotate. Bias toward caution.
  - Exit gate on operator signal: schema validation, section completeness, annotation check via `check-draft.js` (operator must review and remove any annotations), diff-aware URL verification
- [x] 13b — Index sync:
  - Detect changes to title, keywords, hass_domains, type, or pattern essence
  - Update the corresponding row in `drafts/pattern-index.md`
  - Rewrite summary if the pattern's nature has shifted
- [x] 13c — Cross-reference maintenance:
  - If Related Patterns section changed, update back-references in affected published patterns
  - Same logic as `/publish` cross-referencing, but operating on changes rather than new additions
- [x] 13d — Git integration:
  - Offer to create feature branch and commit (pattern file, updated index, any cross-referenced patterns)
- [x] 13e — Update documentation:
  - `docs/ai-authorship-workflow.md` — add update workflow section
  - `CLAUDE.md` — add `/update` to AI Authorship Commands
  - `docs/implementation_plan.md` — this phase
- [x] 13f — Manual testing:
  - Edit a published pattern via `/update`, verify exit gate catches a deliberately broken field
  - Change keywords, verify index row updates
  - Add a Related Pattern entry, verify back-reference created in the target pattern
  - Ask model to generate new substantive content, verify it is annotated
  - Verify exit gate blocks completion while annotations remain
  - Remove annotations, verify exit gate passes

### Design Decisions

- **No return to draft.** Published patterns stay in `src/content/patterns/` throughout. Git diff is the audit trail for changes.
- **Selective annotation.** Unlike `/draft` (everything annotated), `/update` only annotates model-generated substantive content. Operator-directed edits are not annotated — the operator is the author. When in doubt, the model annotates. The exit gate runs `check-draft.js` so annotations cannot slip through unreviewed.
- **No quality review stage.** The pattern already passed quality review at publication.
- **PR/CI remains the real gate.** `/update` provides convenience and prevents supporting data from silently drifting.

**Done when:** `/update` loads a published pattern by path or ID, supports interactive editing with selective annotation, exit gate enforces annotation review, syncs index and cross-references on change.

---

## Phase 14 — Source Pointer Annotation Format

**Completed:** 2026-03-26

Migrate EXTRACTED annotations from embedded quotes to pointer-based references. Sensitive source content stays in `_sources/` (gitignored), never in draft files. See `docs/change-spec-source-pointer-review-tool.md` for full rationale.

- [x] 14a — Update `/draft` command (`.claude/commands/draft.md`):
  - Stage 4: new EXTRACTED annotation syntax with `ptr` field (file + line range) replacing embedded quotes
  - Instruction: ensure `.txt` rendition exists in `_sources/` before writing pointers
  - Instruction: record line ranges at time of reading, never embed quoted/paraphrased source text
  - `basis` field is a short description only (not a quote)
- [x] 14b — Update `tools/prompt-templates/pattern.md`:
  - Update Extraction Provenance Conventions section with new pointer syntax
- [x] 14c — Update `scripts/check-draft.js`:
  - Update annotation detection regex to match new EXTRACTED format (pointer-based)
  - Add optional lint: flag `basis` fields longer than ~100 chars or containing quotation marks
- [x] 14d — Update `docs/spec.md`:
  - §3: add `check-draft.js` to repo structure
  - §4: add Draft Annotation Syntax section with pointer-based EXTRACTED format
  - §7: update `/draft` Stage 4 description with text rendition and pointer workflow
  - §8: add Text Renditions subsection, Anonymised Source Filenames subsection
- [x] 14e — Update `CLAUDE.md`:
  - Update annotation syntax in Key Constraints and AI Authorship Commands sections
- [ ] 14f — Manual testing:
  - Run `check-draft.js` against a draft containing new-format EXTRACTED annotations — verify detected and counted
  - Run `check-draft.js` against a clean file (no annotations) — verify passes
  - Run `/draft` against a source document in `_sources/` — verify EXTRACTED annotations use pointer syntax, no embedded quotes, `.txt` rendition created
  - Run `/publish` against a draft with new-format annotations remaining — verify it blocks

### Deviations

- **`review-server.js` not added to §3 repo structure.** The change spec listed it for 14d, but the review server is a Phase 15 deliverable. Added `check-draft.js` only — `review-server.js` will be added in Phase 15.
- **Prompt template output path corrected.** `tools/prompt-templates/pattern.md` still pointed to `src/content/patterns/` as the output path. Updated to reflect the draft/publish split (`drafts/patterns/` for drafts, `src/content/patterns/` for published).
- **Prompt template `pattern_id` format updated.** The frontmatter example still used the old `RSE-HASS-NNN` format. Updated to `I-001` typed format.

### Design Decisions

- **No migration burden.** The repo has only two published patterns and an empty drafts directory. No existing annotations to convert.
- **ELABORATED unchanged.** Only EXTRACTED annotations change — ELABORATED annotations contain no source material and are unaffected.
- **`/extract`, `/publish`, `/update` unchanged.** These commands do not produce EXTRACTED annotations with quotes. `/update` uses ELABORATED only.

**Done when:** `/draft` writes pointer-based EXTRACTED annotations. `check-draft.js` detects the new format. Documentation reflects new syntax throughout.

---

## Phase 15 — Local-First Extraction & Drafting Workflow

**Completed:** 2026-03-26

Restructure the extraction and drafting pipeline so that proto-patterns and annotated drafts are user-local (gitignored), not committed to the repo. Solves source locality, protopattern leakage, and multi-user complexity problems identified during Phase 14 testing. See `docs/change-local-first_extraction.md` for full rationale.

- [x] 15a — Create `_local/` directory structure:
  - Create `_local/protopatterns/` with empty `index.md`
  - Create `_local/drafts/`
  - Add `_local/` to `.gitignore`
  - Delete `drafts/protopatterns/` directory (move any existing content to `_local/protopatterns/` first)

- [x] 15b — Update `/extract` command (`.claude/commands/extract.md`):
  - Change all output paths from `drafts/protopatterns/` to `_local/protopatterns/`
  - Change index path from `drafts/protopatterns/index.md` to `_local/protopatterns/index.md`
  - Add local-only note to preamble: proto-patterns are user-local working notes, not shared artefacts
  - Reinforce instruction: no source content (quotes, paraphrases) in proto-pattern files

- [x] 15c — Update `/draft` command (`.claude/commands/draft.md`):
  - Change output path from `drafts/patterns/{slug}.md` to `_local/drafts/{slug}.md`
  - Change proto-pattern input path from `drafts/protopatterns/` to `_local/protopatterns/`
  - Update proto-pattern cleanup paths (`_local/protopatterns/index.md`, `_local/protopatterns/{file}.md`)
  - Add Stage 5 — Export Gate:
    1. Verify annotations: operator checks `ptr:` ranges against source files
    2. Strip annotations: remove all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers
    3. Copy to repo: move clean draft to `drafts/patterns/{slug}.md`
    4. Commit on feature branch
    5. Report export checklist to operator (including `check-draft.js` verification command)
  - Update Pre-flight Branch Gate: commits happen to `drafts/patterns/`, not `_local/drafts/`

- [x] 15d — Update `/publish` command (`.claude/commands/publish.md`):
  - Add pre-flight annotation check guard: run `check-draft.js` on target file before proceeding
  - If annotations detected, halt and instruct operator to complete export gate first

- [x] 15e — Update `scripts/check-draft.js`:
  - Ensure it works on both `_local/drafts/` and `drafts/patterns/` paths (no path restrictions)

- [x] 15f — Update documentation:
  - `docs/spec.md` — §3 repo structure (remove `drafts/protopatterns/`, add `_local/`), §7 command descriptions (updated paths, export gate), §10 workflow (local-first model, single-user v1 note)
  - `docs/ai-authorship-workflow.md` — update all `drafts/protopatterns/` references, update draft output paths, add Export Gate section, add note about deferred review tool
  - `CLAUDE.md` — update Architecture section (local-first structure), update command descriptions with new paths

- [x] 15g — Automated verification:
  - `_local/` is in `.gitignore`
  - `drafts/protopatterns/` directory does not exist
  - `/extract` command file contains `_local/protopatterns` (not `drafts/protopatterns`)
  - `/draft` command file contains `_local/drafts` and `_local/protopatterns` (not old paths)
  - `/draft` command file contains "Export Gate" or "export gate"
  - `/publish` command file contains annotation check guard language
  - `check-draft.js` accepts paths outside `drafts/patterns/`

- [ ] 15h — Manual acceptance testing:
  - Run `/extract` against a source document — verify proto-pattern output goes to `_local/protopatterns/`, index updated at `_local/protopatterns/index.md`
  - Run `/draft` from proto-pattern — verify annotated draft output goes to `_local/drafts/` with pointer-based annotations
  - Verify `_local/` contents do not appear in `git status`
  - Manually strip annotations from draft, copy to `drafts/patterns/`, run `node scripts/check-draft.js drafts/patterns/{slug}.md` — verify passes (no annotations detected)
  - Copy annotated draft (without stripping) to `drafts/patterns/`, run `/publish` — verify it blocks with annotation check failure
  - Run `node scripts/check-draft.js _local/drafts/{slug}.md` — verify annotations detected and counted

### Deviations

- **`check-draft.js` unchanged.** The script already accepts arbitrary file paths with no path restrictions, so no code changes were needed for 15e.
- **`/draft` export gate includes agent-assisted option.** The implementation plan specified a manual export gate only, but the `/draft` command now offers the operator a choice: ask Claude to strip annotations and copy to `drafts/patterns/`, or do it manually. This reduces friction without removing operator control.
- **Existing proto-patterns migrated.** 7 proto-patterns and an index file were moved from `drafts/protopatterns/` to `_local/protopatterns/`.

### Design Decisions

- **Single-user for v1.** The person who extracts is the person who drafts. Multi-user source sharing (SharePoint sync, encrypted bundles) is explicitly deferred.
- **Collaboration at PR stage.** Teams review clean drafts via pull requests — the substance and quality, not the AI provenance annotations.
- **Export via `/export` command.** Phase 16 introduced a standalone `/export` command that handles branch creation, annotation verification, clean copy, and commit. The `/draft` command is now purely local.
- **No migration burden.** The repo had minimal content in `drafts/protopatterns/` — move-and-delete was straightforward.

**Done when:** Proto-patterns and annotated drafts are written to `_local/` (gitignored). Clean drafts are exported to `drafts/patterns/` for commit. No source-derived content is ever committed. Commands and documentation reflect local-first workflow.

---

## Phase 16 — Decouple Branch/Commit from Draft & Introduce `/export` Command

Extract the branch gate and export step from `/draft` into a standalone `/export` command. The `/draft` command becomes purely local (no git operations), and `/export` handles the transition from local annotated draft to committed clean artefact. This prepares the workflow for the review tool (Phase 17) which will sit between `/draft` and `/export`. See `docs/change-draft-export.md` for full rationale.

- [x] 16a — Update `/draft` command (`.claude/commands/draft.md`):
  - Remove Pre-flight Branch Gate section entirely (no git operations during drafting)
  - Remove Stage 5 (Export Gate) — no annotation stripping, no copy to `drafts/patterns/`, no commit
  - Replace with a handoff message reporting: file location (`_local/drafts/{slug}.md`), annotation counts, validation status, and next steps (review annotations, then run `/export`)
  - Renumber stages: Classify → Extract → Elaborate → Validate (4 stages, not 5)

- [x] 16b — Create `/export` command (`.claude/commands/export.md`):
  - **Branch gate:** If on `master`, create `feature/pattern-{slug}` (with safety checks for unpushed commits, behind-origin state). If already on a feature branch, proceed.
  - **Annotation check:** Run `check-draft.js` against `_local/drafts/{slug}.md`. If annotations remain, halt and direct operator to complete review.
  - **Strip and copy:** Remove any residual annotation markers, write clean file to `drafts/patterns/{slug}.md`.
  - **Verify:** Run `check-draft.js` against exported file to confirm clean.
  - **Commit:** Offer to commit on the feature branch.

- [x] 16c — Update `/publish` command (`.claude/commands/publish.md`):
  - Update annotation check pre-flight to note that `/export` should have been run first
  - No structural changes (its own branch gate remains)

- [x] 16d — Update documentation:
  - [x] `CLAUDE.md` — add `/export` to AI Authorship Commands and workflow description
  - [x] `docs/ai-authorship-workflow.md` — update workflow to show `/draft` → review → `/export` → `/publish` sequence
  - [x] `docs/spec.md` — update command descriptions and workflow (§7, §10)
  - [x] `docs/implementation_plan.md` — this phase

- [x] 16e — Manual testing:
  - ✔ Run `/draft` — verify it produces `_local/drafts/{slug}.md` with no git operations, no branch creation, no export
  - ✔ Verify `/draft` output includes handoff message with annotation counts and next-step instructions
  - ✔ Run `/export` on a draft with annotations remaining — verify it halts with clear message
  - ✔ Strip annotations from draft, run `/export` — verify branch creation, clean copy to `drafts/patterns/{slug}.md`, `check-draft.js` passes, commit offered
  - ✔ Run `/export` while already on a feature branch — verify it proceeds without creating a new branch
  - ✔ Run `/publish` after `/export` — verify normal publish flow works

### Design Decisions

- **`/export` name chosen over `/commit-draft` or `/stage`.** Concise, matches existing "export gate" terminology.
- **`/publish` does not subsume `/export`.** Keeping them separate preserves the PR review step between export and publication. The `drafts/patterns/` intermediate directory has value as the PR-reviewable artefact.
- **No migration needed.** Existing clean drafts in `drafts/patterns/` continue to work with `/publish` as-is. Change is workflow-only, going forward.

**Done when:** `/draft` is purely local with no git operations. `/export` handles branch creation, annotation verification, clean copy, and commit. `/publish` flow unchanged. Documentation reflects the five-command workflow: `/extract` → `/draft` → `/export` → `/publish` → `/update`.

---

## Phase 17 — Pattern Template Simplification

Simplify the pattern template to retain only sections that are attestable from practitioner experience — interviews, project documentation, or domain knowledge. Remove sections that encourage AI-generated filler, move boilerplate to Astro-rendered site furniture, and consolidate overlapping sections. See `docs/change-proposal-template-simplification.md` for full rationale.

This phase must be implemented **before** the externalised relationships proposal (`docs/change-proposal-externalised-relationships.md`), which further modifies the template and detail page.

- [x] 17a — Write new pattern template (`docs/patterns/2 - Pattern_Template.md`):
  - 9 required H2 sections: Intent, Context, Issues, Motivating Example, Solution, Implementation Examples, Consequences, Known Uses, References
  - Context sub-headings: When This Pattern Applies, When This Pattern Does NOT Apply, Prerequisites
  - Issues sub-headings: Issue N: [Name], Key Constraints
  - Solution sub-headings: Core Idea, Key Principles, Solution Structure, How the Issues Are Balanced
  - Consequences sub-headings: What You Gain, What You Accept (remove Risks to Manage)
  - References consolidates former Resources (Learning Materials, Code Examples, Tools, Further Reading) and absorbs pattern-specific citations
  - Remove: Pattern Metadata (duplicates frontmatter), Related Patterns, Context-Specific Guidance, Common Variations, Pitfalls to Avoid, Values and Considerations, Validation Checklist, How to Contribute, Citation, Metadata (DOI/License/Repository), Acknowledgments, Key References

- [x] 17b — Update `EXPECTED_SECTIONS` in `src/schemas/pattern.js`:
  - New list: Intent, Context, Issues, Motivating Example, Solution, Implementation Examples, Consequences, Known Uses, References
  - Removes: Context-Specific Guidance, Related Patterns
  - Adds: Motivating Example, References

- [x] 17c — Update `/publish` command (`.claude/commands/publish.md`):
  - Update section completeness check (step 3) to match new `EXPECTED_SECTIONS`
  - Remove Related Patterns cross-reference step (step 4) — handled by externalised relationships proposal

- [x] 17d — Update `/draft` command (`.claude/commands/draft.md`):
  - Update output structure to target the simplified 9-section template
  - Remove instructions for generating Context-Specific Guidance, Common Variations, Pitfalls to Avoid, Related Patterns, Resources (replaced by References)
  - Fewer sections means more focused extraction passes

- [x] 17e — Add Astro-rendered boilerplate to pattern detail page (`src/pages/patterns/[...slug].astro`):
  - **Key References** — static content: Alexander (1977), CARE Principles (2020), Gamma et al. (1994), and other foundational references shared across all patterns
  - **Citation** — generated from frontmatter fields (pattern_id, title, author, last_updated)
  - **License and Repository** — static site-level content
  - **Acknowledgments** — static site-level content (ARDC HASS RDC, etc.)
  - These render below `<Content />`, outside the pattern markdown body

- [x] 17f — Remove existing published patterns:
  - Delete all files in `src/content/patterns/` (A-004, D-002, I-005)
  - Clear `drafts/pattern-index.md` (reset to header row only)
  - Rationale: template changes are too significant for incremental migration; these are prototype toy data

- [x] 17g — Update documentation:
  - `CLAUDE.md` — update body section list in Phase 1 design note, update Architecture section to reflect simplified template and boilerplate rendering
  - `docs/spec.md` — update §4 (pattern structure: new section list, boilerplate rendering), §7 (command descriptions where sections are referenced)
  - `docs/ai-authorship-workflow.md` — update section references throughout, document that boilerplate sections are Astro-rendered not author-written
  - `docs/patterns/1 - Pattern_Definition_Guide.md` — update any section references to match simplified structure
  - `docs/implementation_plan.md` — mark this phase complete

- [x] 17h — Automated testing:
  - `npm run validate` passes with no patterns present (empty collection)
  - `npm run build` succeeds — site builds with updated Astro template and boilerplate sections
  - Create a minimal test pattern file matching the new template structure, validate it passes `npm run validate -- --publish`
  - Delete test pattern after verification

- [x] 17i — Visual verification:
  - `npm run dev` — verify pattern detail page renders boilerplate sections (Key References, Citation, License, Acknowledgments) below pattern content
  - Verify boilerplate sections use appropriate styling and are visually distinct from pattern content

- [x] 17j — Manual acceptance testing:
  - Run `/draft` against a source document — verify output matches simplified 9-section structure (no removed sections generated)
  - Run `/publish` against a file missing one of the new required sections — verify it rejects with clear error
  - Run `/publish` against a file with old sections (e.g. Context-Specific Guidance) but missing new ones (e.g. References) — verify it catches the missing section

### Design Decisions

- **Delete rather than migrate published patterns.** The template changes are substantial enough that updating 3 prototype toy patterns is not worth the effort. Clean slate.
- **Boilerplate in Astro, not markdown.** Key References, Citation, License, and Acknowledgments are site-level content maintained in one place. Patterns should contain only pattern-specific substance.
- **References consolidates Resources.** A single References section replaces the split across Resources (with sub-headings) and Key References. Foundational references move to Astro boilerplate; pattern-specific references stay in the markdown.
- **Related Patterns deferred to externalised relationships.** The section is removed here; the next proposal introduces Astro-rendered relationship data.

**Done when:** Pattern template has 9 attestable sections. `EXPECTED_SECTIONS` updated. Published patterns removed. Astro detail page renders boilerplate. `/draft` and `/publish` target simplified structure. All documentation reflects the new template.

---

## Phase 18 — Externalised Pattern Relationships and Principle Alignments

**Completed:** 2026-04-08

Move relationship and principle alignment data out of pattern markdown bodies into shared JSON/YAML data files. Introduce a `/relate` skill for LLM-assisted relationship computation and principle alignment. Astro renders both sections from data at build time, keeping all pattern pages current. See `docs/change-proposal-externalised-relationships.md` for full rationale.

### 18a — Create data files and validation tool

- [x] Create `src/data/` directory
- [x] Create `src/data/principles.yml` — FAIR + sustainability scaffold (5 principles as specified in change proposal)
- [x] Create `src/data/related-patterns.json` — empty object `{}`
- [x] Create `src/data/principle-alignments.json` — empty object `{}`
- [x] Create `scripts/update-relationships.js`:
  - Two modes: `relate` (merge related patterns) and `align` (merge principle alignments)
  - Accepts `--input` JSON payload via CLI argument
  - Validates payload with Zod schemas:
    - `relate`: correct shape, valid relationship types (`works-well-with`, `alternative-approach`, `typical-sequence-before`, `typical-sequence-after`), referenced pattern IDs exist in `src/content/patterns/`
    - `align`: valid principle IDs from `principles.yml`, non-empty relevance text
  - Loads existing JSON, merges (append, no duplicates by `related_id` for relate; replace by `principle_id` per pattern for align), writes back
  - Both modes idempotent and safe to re-run
  - Returns structured success/failure output

### 18b — Automated testing: validation tool

- [x] Test `relate` mode: valid payload merges correctly, duplicate `related_id` not duplicated on re-run
- [x] Test `relate` mode: invalid relationship type rejected
- [x] Test `relate` mode: non-existent pattern ID rejected
- [x] Test `align` mode: valid payload merges correctly, re-run replaces by `principle_id`
- [x] Test `align` mode: invalid principle ID rejected
- [x] Test `align` mode: empty relevance text rejected
- [x] Test both modes: output files are valid JSON after merge

### 18c — Update pattern template and schema

- [x] Update `docs/patterns/2 - Pattern_Template.md`:
  - "Related Patterns" section already removed in Phase 17 — confirmed absent
  - Add note: related patterns and principle alignments are managed externally and rendered automatically
- [x] Update `EXPECTED_SECTIONS` in `src/schemas/pattern.js`:
  - "Related Patterns" already absent after Phase 17 — confirmed
  - Removed "References" from required list (was added in Phase 17; now optional)
  - Final list (8 sections): Intent, Context, Issues, Motivating Example, Solution, Implementation Examples, Consequences, Known Uses
- [x] Remove "Related Patterns" H2 section from any existing published patterns — confirmed already absent from `co-located-data-and-metadata.md`

### 18d — Update Astro pattern detail page

- [x] Update `src/pages/patterns/[...slug].astro`:
  - Import `src/data/related-patterns.json`
  - Import `src/data/principle-alignments.json`
  - Parse `src/data/principles.yml` via `js-yaml` (added as dependency) with `readFileSync` at build time
  - **Related Patterns section** (below `<Content />`):
    - Filter `related-patterns.json` for current pattern's ID
    - Group by relationship type (using human-readable labels: "Works Well With", "Alternative Approach", "Typical Sequence: Before", "Typical Sequence: After")
    - Render each related pattern as a link to its pattern page with rationale text
    - Render nothing (no heading, no empty section) if no relationships exist
  - **Principle Alignments section** (below Related Patterns):
    - Filter `principle-alignments.json` for current pattern's ID
    - Look up principle name and group from `principles.yml`
    - Render each aligned principle with group tag, name, and relevance text
    - Render nothing if no alignments exist

### 18e — Automated testing: rendering

- [x] `npm run build` succeeds with empty relationship/alignment data (no sections rendered)
- [x] Seed `related-patterns.json` and `principle-alignments.json` with test data for A-004, verify `npm run build` succeeds
- [x] Verified rendered HTML contains Related Patterns section with correct grouping, links, and rationale text
- [x] Verified rendered HTML contains Principle Alignments section with principle name, group, and relevance
- [x] Cleaned up test data after verification

### 18f — Create `/relate` skill

- [x] Create `.claude/commands/relate.md`:
  - **Arguments:** pattern ID (required). Pattern must exist in `src/content/patterns/`
  - **Phase 1 — Typological pairing:**
    - Use target pattern's `pattern_type` to ask a focused question
    - If type A: present all published I-patterns from index, ask which are concrete implementations
    - If type I: present all published A-patterns, ask which architectural principles this implements
    - D and P types: skip this phase (picked up in phase 2)
    - Output: `(related_id, relationship_type, rationale_both_directions)` tuples
  - **Phase 2 — General relatedness:**
    - Present target pattern against full published pattern index
    - Exclude patterns already identified in phase 1
    - Model identifies related patterns, classifies relationship types, writes bidirectional rationales
    - Output: additional `(related_id, relationship_type, rationale_both_directions)` tuples
  - **Phase 3 — Principle alignment:**
    - Read `src/data/principles.yml` for all principle definitions
    - Read target pattern content
    - Single LLM call: select most relevant principles (2–4), write concise relevance statement for each
    - Output: `(principle_id, relevance)` tuples
  - **Phase 4 — Combine and persist:**
    - Merge phases 1+2 (phase 1 takes precedence on overlap)
    - Format as JSON payloads
    - Call `scripts/update-relationships.js relate --input '{...}'`
    - Call `scripts/update-relationships.js align --input '{...}'`
    - Report all changes to operator
  - **`--all` mode:** iterate over all published pattern IDs, run full pipeline for each

### 18g — Update `/publish` skill

- [x] Update `.claude/commands/publish.md`:
  - Step 3 (section completeness): confirmed list is 8 sections (no "Related Patterns")
  - Added step 4: invoke `/relate` skill with the newly published pattern's ID
  - Step 6 (commit offer): includes `src/data/related-patterns.json` and `src/data/principle-alignments.json` in the commit alongside pattern file and index

### 18h — Update `/update` skill

- [x] Update `.claude/commands/update.md`:
  - Updated section completeness to 8 sections
  - Added step 4b: suggest re-running `/relate` for substantive content changes
  - No cross-reference maintenance step to remove (never existed as a separate step)

### 18i — Update documentation

- [x] `CLAUDE.md`:
  - Added `/relate` to AI Authorship Commands
  - Updated Architecture section: noted externalised relationships, data files, principle alignments
  - Updated `/publish` description to mention `/relate` invocation
  - Updated `/update` description to mention `/relate` suggestion
- [x] `docs/spec.md`:
  - §3 repo structure: added `src/data/` directory with data files and `scripts/update-relationships.js`
  - §4: updated pattern structure (8 required sections, externalised relationships note)
  - §7: added `/relate` command description, updated `/publish` description, updated command count to six
- [x] `docs/ai-authorship-workflow.md`:
  - Added `/relate` to overview and workflow documentation
  - Updated `/publish` workflow to show `/relate` invocation
  - Added "Computing Relationships and Principle Alignments" section
  - Added `/relate` to "What Claude Code Sees" list
- [x] `docs/implementation_plan.md` — marked phases 18a–18i complete

### 18j — Wipe existing published patterns and republish from drafts

- [ ] Delete all files in `src/content/patterns/` (currently only `co-located-data-and-metadata.md`)
- [ ] Clear `drafts/pattern-index.md` (reset to header row only)
- [ ] Clear `src/data/related-patterns.json` and `src/data/principle-alignments.json` (reset to `{}`)
- [ ] Run `/export` for `_local/drafts/co-located-data-and-metadata.md` → `drafts/patterns/`
- [ ] Run `/export` for `_local/drafts/ro-crate-research-data-packaging.md` → `drafts/patterns/`
- [ ] Run `/publish` for `drafts/patterns/co-located-data-and-metadata.md` — verify publication with new 8-section requirements and `/relate` invocation
- [ ] Run `/publish` for `drafts/patterns/ro-crate-research-data-packaging.md` — verify same
- [ ] Verify `drafts/pattern-index.md` has entries for both patterns
- [ ] Verify `src/data/related-patterns.json` has bidirectional relationships populated
- [ ] Verify `src/data/principle-alignments.json` has alignments for both patterns

### 18k — Manual acceptance testing

- [ ] `npm run validate` passes for all published patterns
- [ ] `npm run build` succeeds
- [ ] `npm run dev` — verify both pattern detail pages render:
  - Related Patterns section with correct links and rationales
  - Principle Alignments section with principle names, groups, and relevance text
- [ ] Run `/relate A-004` (or whichever ID) standalone — verify it updates data files without error
- [ ] Run `/relate --all` — verify it recomputes relationships and alignments for all patterns
- [ ] Run `/publish` on a new test pattern — verify `/relate` is invoked as part of the publish pipeline
- [ ] Verify pattern pages with no relationships/alignments render cleanly (no empty sections)

### Design Decisions

- **Phase 17 prerequisite.** Phase 17 (template simplification) removed most of the Related Patterns section infrastructure. This phase completes the transition by externalising the data entirely.
- **Single JSON per data type.** Atomic updates, simple Astro imports, easy PR diffs.
- **Bidirectional storage.** LLM writes both directions with tailored rationale — explicit over implicit.
- **Skill does LLM work, script does validation/merge.** No additional API credentials; scripts stay deterministic and testable.
- **Decomposed LLM calls.** Typological → general → principles: each call has a narrow, focused question.
- **Republish from local drafts.** Wipe existing published patterns and republish through the updated pipeline to validate the full workflow end-to-end.

**Done when:** Relationships and principle alignments are stored in `src/data/` JSON files, not in pattern markdown. Astro renders both sections from data at build time. `/relate` skill computes relationships and alignments via focused LLM calls. `/publish` invokes `/relate` after publication. Both draft patterns republished through the updated pipeline with relationships and alignments populated.

---

## Updating This Plan

When a phase is complete:

1. Change all `[ ]` items in that phase to `[x]`.
2. Add a completion note below the phase heading: `**Completed:** YYYY-MM-DD`
3. Record any deviations from the original plan (different tool choices, scope changes, etc.).
4. If the phase revealed new work, add it to a subsequent phase or create a new one.
5. Commit the updated plan to the repo.
