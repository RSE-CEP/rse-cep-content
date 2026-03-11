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
- **Provenance fields are separate from pattern metadata.** `source_type`, `source_ref`, and `confidence` are extraction-pipeline fields populated by the AI tool, not part of the pattern template itself. They are optional in the schema.
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

- [ ] Author at least one pattern via the extraction tool from a real source document
- [ ] Create a feature branch, commit the pattern, push, open a PR
- [ ] Verify CI runs and passes (schema validation + build)
- [ ] Merge the PR
- [ ] Verify the deploy workflow triggers and the site updates on GitHub Pages
- [ ] Document any issues encountered and update this plan

**Done when:** The full cycle described in spec §10 has been exercised successfully.

---

## Updating This Plan

When a phase is complete:

1. Change all `[ ]` items in that phase to `[x]`.
2. Add a completion note below the phase heading: `**Completed:** YYYY-MM-DD`
3. Record any deviations from the original plan (different tool choices, scope changes, etc.).
4. If the phase revealed new work, add it to a subsequent phase or create a new one.
5. Commit the updated plan to the repo.
