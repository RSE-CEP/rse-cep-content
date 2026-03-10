# RSE-CEP Prototype — Implementation Plan

**Reference:** [docs/spec.md](./docs/spec.md)
**Status key:** `[ ]` not started · `[~]` in progress · `[x]` complete

---

## Phase 1 — Project Scaffolding

Set up the Astro project, content collection schemas, and directory structure.

- [ ] Initialise Astro project (`npm create astro@latest`)
- [ ] Configure `astro.config.mjs` with `site` and `base` for GitHub Pages
- [ ] Design Zod schema for patterns based on `docs/patterns/2 - Pattern_Template.md` (see design notes below)
- [ ] Create Zod schemas in `src/content/config.ts` (patterns first; roadmap and principles out of prototype scope)
- [ ] Create content collection directory: `src/content/patterns/`
- [ ] Add placeholder pattern file to validate schema wiring
- [ ] Set up `.gitignore` (include `_sources/`, `node_modules/`, `dist/`)
- [ ] Install dev dependencies (`gray-matter`, `tsx`)
- [ ] Create `_sources/` directory with a `.gitkeep` (directory exists but contents ignored)

### Design Note: Pattern Schema

The spec (§4) now reflects the pattern template structure. Key design decisions:

- **Frontmatter for Astro, body for template structure.** Queryable fields (`title`, `pattern_id`, `keywords`, `hass_domains`, etc.) live in YAML frontmatter for Astro content collections. The full pattern template structure (Intent, Context, Issues, Solution, etc.) lives in the markdown body.
- **Provenance fields are separate from pattern metadata.** `source_type`, `source_ref`, and `confidence` are extraction-pipeline fields populated by the AI tool, not part of the pattern template itself. They are optional in the schema.
- **Body sections follow the pattern template.** Essential sections: Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses, Related Patterns. Additional sections are optional.
- **No maturity field.** Maturity judgements are out of scope for this pipeline.

**Done when:** `npm run dev` starts, placeholder pattern renders without errors.

---

## Phase 2 — Validation Script

Build the schema validation script used by both CI and the AI extraction agent.

- [ ] Create `scripts/validate.js` per spec §5
- [ ] Accept file path argument or glob across `src/content/`
- [ ] Parse YAML frontmatter with `gray-matter`
- [ ] Validate against Zod schema (pattern type)
- [ ] Soft-warn on missing body sections per pattern template conventions (Intent, Context, Issues, Solution, etc.)
- [ ] Structured output: pass/fail, field-level errors, section warnings
- [ ] Non-zero exit code on validation failure
- [ ] Add `validate` script to `package.json`
- [ ] Test against placeholder content (should pass) and a deliberately broken file (should fail)

**Done when:** `npm run validate` runs cleanly against all content, catches intentional errors.

---

## Phase 3 — GitHub Actions CI/CD

Set up the PR validation and deployment workflows.

- [ ] Create `.github/workflows/ci.yml` — PR validation
  - [ ] Trigger on pull requests targeting `main`
  - [ ] Step 1: Schema validation (`node scripts/validate.js`)
  - [ ] Step 2: Trial Astro build (`npx astro build`)
- [ ] Create `.github/workflows/deploy.yml` — GitHub Pages deployment
  - [ ] Trigger on push to `main`
  - [ ] Build Astro site
  - [ ] Upload artifact via `actions/upload-pages-artifact`
  - [ ] Deploy via `actions/deploy-pages`
- [ ] Configure GitHub repo settings (see [docs/github-actions-setup.md](./docs/github-actions-setup.md)):
  - [ ] Enable GitHub Pages with source = GitHub Actions
  - [ ] Add branch protection on `main` requiring CI status checks
- [ ] Test: open a PR with valid content → CI passes
- [ ] Test: open a PR with invalid frontmatter → CI fails with clear error

**Done when:** PRs are gated by schema validation + build check; merges to main auto-deploy.

---

## Phase 4 — Claude Skill / AI Extraction Tooling

Build the Claude Code skill that performs AI-assisted content extraction.

- [ ] Create `tools/claude-skill.md` — skill definition with tool declarations
- [ ] Create prompt template `tools/prompt-templates/pattern.md` referencing the canonical pattern template (`docs/patterns/2 - Pattern_Template.md`)
- [ ] Implement the four-stage extraction flow (classify → extract → elaborate → validate)
- [ ] Ensure the skill populates both YAML frontmatter (for Astro) and the full body template structure
- [ ] Ensure the skill invokes `scripts/validate.js` after writing output
- [ ] Test with a real source document from `_sources/`
- [ ] Document the skill usage in [docs/ai-authorship-workflow.md](./docs/ai-authorship-workflow.md)

**Done when:** Running the skill against a source document produces a valid pattern file that passes schema validation and follows the pattern template structure.

---

## Phase 5 — Minimal Site Templates

Create Astro page templates that render content collection items.

- [ ] Create index page listing all patterns (filterable by keywords, hass_domains)
- [ ] Create individual pattern page template that renders the full pattern structure
- [ ] Basic layout with navigation (minimal styling — functional, not pretty)
- [ ] Render pattern metadata table from frontmatter
- [ ] Render the rich body structure (Intent, Context, Issues, Solution, etc.)
- [ ] Verify the built site works on GitHub Pages (correct base path handling)

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
