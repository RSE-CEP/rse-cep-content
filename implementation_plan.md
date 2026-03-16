# RSE-CEP Prototype — Implementation Plan

**Reference:** [docs/spec.md](./docs/spec.md)
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
- [x] Update `implementation_plan.md` — add phases 7-9

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
  - [x] `implementation_plan.md` — this phase
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
  - [x] `implementation_plan.md` — this phase

### Deviations

- None.

**Done when:** All 3 patterns validate with new schema, site builds with type display, commands reference typology throughout.

---

## Phase 12 — Published Pattern Index & Related Pattern Proposals

Introduce an agent-maintained index of published patterns (`drafts/pattern-index.md`) and use it during `/draft` to propose related patterns for section 9 (Related Patterns) of the template. The index is a markdown table — same approach as the proto-pattern index — with an agent-written summary column for semantic matching.

- [ ] 12a — Create `drafts/pattern-index.md`:
  - Markdown table with columns: ID, Type, Title, Keywords, HASS Domains, Summary
  - Summary is a one-line agent-written description (not mechanically extracted) — compact enough for the `/draft` agent to reason about relationships
  - Seed with entries for any currently published patterns (if none, create with header row only)
- [ ] 12b — Update `/publish` command (`.claude/commands/publish.md`):
  - After successful publication, append a row to `drafts/pattern-index.md`
  - Agent writes a concise one-line summary capturing the pattern's essence for relationship matching
  - If `drafts/pattern-index.md` doesn't exist, create it with the header row first
- [ ] 12c — Update `/draft` command (`.claude/commands/draft.md`):
  - In Stage 3 (Guided Elaboration), read `drafts/pattern-index.md`
  - Match the draft pattern against published patterns using the index (shared keywords, domains, type, and semantic relevance of summaries)
  - Present a table of proposed related patterns with relationship type (Works Well With / Alternative Approaches / Typical Sequence) and rationale
  - Operator confirms, rejects, or edits proposals before inclusion in the Related Patterns section
  - If `drafts/pattern-index.md` is missing or empty, skip gracefully with a note
- [ ] 12d — Update documentation:
  - [x] `docs/spec.md` — repo structure, `/draft` and `/publish` command descriptions
  - [ ] `CLAUDE.md` — note index in Architecture section, add `drafts/pattern-index.md` to key files
  - [ ] `docs/ai-authorship-workflow.md` — document related pattern proposal step in draft workflow
  - [ ] `implementation_plan.md` — this phase
- [ ] 12e — Manual testing:
  - Publish a pattern via `/publish`, verify row appended to `drafts/pattern-index.md` with good summary
  - Run `/draft` with published patterns present, verify related pattern proposals appear
  - Run `/draft` with no published patterns, verify graceful skip

**Done when:** `/publish` appends to the pattern index on publication. `/draft` reads the index and proposes related patterns during elaboration. Index is committed to repo.

---

## Updating This Plan

When a phase is complete:

1. Change all `[ ]` items in that phase to `[x]`.
2. Add a completion note below the phase heading: `**Completed:** YYYY-MM-DD`
3. Record any deviations from the original plan (different tool choices, scope changes, etc.).
4. If the phase revealed new work, add it to a subsequent phase or create a new one.
5. Commit the updated plan to the repo.
