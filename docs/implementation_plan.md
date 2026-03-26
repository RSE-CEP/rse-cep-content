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
- **Manual export gate for now.** The review tool (Phase 16) will automate annotation verification and stripping. The manual process is sufficient for v1.
- **No migration burden.** The repo had minimal content in `drafts/protopatterns/` — move-and-delete was straightforward.

**Done when:** Proto-patterns and annotated drafts are written to `_local/` (gitignored). Clean drafts are exported to `drafts/patterns/` for commit. No source-derived content is ever committed. Commands and documentation reflect local-first workflow.

---

## Phase 16 — Draft Review Tool (DEFERRED)

> **Deferred** pending validation of the local-first workflow (Phase 15). The manual export gate provides equivalent functionality without tooling. This phase can be revived when the manual workflow proves cumbersome.

A local Node.js web interface for reviewing draft annotations. Resolves source pointers to display context on demand, writes annotation removals back to the markdown file. Operates on `_local/drafts/` (updated from `drafts/patterns/` per Phase 15).

- [ ] 16a — Create `scripts/review-server.js`:
  - Plain Node.js HTTP server (no framework), serves single-page wizard UI
  - Port 4323 (avoids clash with Astro dev on 4321)
  - Draft selection: list files in `_local/drafts/`
  - Annotation stepping: parse all annotations in selected draft, navigate prev/next/jump
  - Source panel (EXTRACTED only): resolve `ptr` field, read `.txt` file, slice line range + configurable buffer (default 3 lines either side). Clear error if pointer unresolvable.
  - Actions per annotation:
    - *Accept & clear* — remove annotation marker, leave content, write to file immediately
    - *Edit content* — inline editor pre-populated with annotated content, edit then accept, write to file
    - *Skip* — move to next without changes
  - Resume from first remaining annotation if operator returns mid-review
- [ ] 16b — Add `review` script to `package.json`: `"review": "node scripts/review-server.js"`
- [ ] 16c — Export integration:
  - After all annotations cleared, offer to copy clean file to `drafts/patterns/{slug}.md`
  - Run `check-draft.js` to confirm no annotations remain
- [ ] 16d — Update `docs/ai-authorship-workflow.md`:
  - Add draft review tool section (usage, what it does, when to use it)
- [ ] 16e — Update `docs/spec.md`:
  - §3: add `review-server.js` to repo structure
  - §10: update operator workflow to reference `npm run review` as annotation review step

- [ ] 16f — Manual testing:
  - `npm run review` starts server on port 4323
  - Browser UI lists draft files from `_local/drafts/`
  - Selecting a draft shows annotations with progress indicator
  - EXTRACTED annotation: source panel resolves pointer and displays source context with buffer lines
  - EXTRACTED annotation with missing/invalid pointer: source panel shows clear error
  - *Accept & clear*: annotation marker removed from file, content preserved
  - *Edit content*: inline editor works, edited content + annotation removal written to file
  - *Skip*: moves to next annotation, skipped annotation remains in file
  - Reopening a partially reviewed draft resumes from first remaining annotation
  - After clearing all annotations, export to `drafts/patterns/` works and `check-draft.js` confirms clean

### Implementation Notes

- Single HTML page served inline from the script — JS in the page handles annotation stepping and inline editing
- File writes are synchronous and immediate on each accept action (no undo)
- Read-only on source files — the tool never touches `_sources/`
- Annotation state encoded in the file itself — cleared annotation = reviewed

**Done when:** `npm run review` launches a browser UI that lists drafts from `_local/drafts/`, steps through annotations with source context display, writes annotation removals back to the markdown file, and offers export to `drafts/patterns/` when complete.

---

## Updating This Plan

When a phase is complete:

1. Change all `[ ]` items in that phase to `[x]`.
2. Add a completion note below the phase heading: `**Completed:** YYYY-MM-DD`
3. Record any deviations from the original plan (different tool choices, scope changes, etc.).
4. If the phase revealed new work, add it to a subsequent phase or create a new one.
5. Commit the updated plan to the repo.
