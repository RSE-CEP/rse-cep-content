# CLAUDE.md — RSE-CEP Prototype

AI-assisted content pipeline prototype: source document extraction → structured markdown → PR/CI validation → GitHub Pages deployment.

## Documentation

- **[docs/spec.md](docs/spec.md)** — Project specification (authoritative reference)
- **[docs/implementation_plan.md](docs/implementation_plan.md)** — Phased build plan. Update when phases complete: mark `[x]`, add completion date, note deviations.
- **[docs/patterns/](docs/patterns/)** — Pattern content type documentation:
  - `1 - Pattern_Definition_Guide.md` — What patterns are, quality criteria, maturity levels
  - `2 - Pattern_Template.md` — **Canonical template** for pattern content. The Zod schema and site templates must reflect this structure.
  - `3 - *.md` — Worked examples (Version Control, Configuration Management)
- **[docs/pattern_typology.md](docs/pattern_typology.md)** — Pattern type definitions (I/A/D/P), classification guide, section emphasis per type
- **[docs/ai-authorship-workflow.md](docs/ai-authorship-workflow.md)** — AI extraction process and operator workflow
- **[docs/github-actions-setup.md](docs/github-actions-setup.md)** — CI/CD setup and deployment
- **[docs/validation-script.md](docs/validation-script.md)** — Schema validation script

## Architecture

Astro + content collections. Zod schemas in `src/content.config.ts` are the single source of truth. Validation via `scripts/validate.js` (used by CI and AI skill). GitHub Actions for PR gating and deployment. Patterns are classified by type — Implementation (I), Architectural (A), Design (D), Process (P) — see `docs/pattern_typology.md`. Type is encoded in the pattern ID (`{I|A|D|P}-NNN`) and cross-validated with `pattern_type` in the schema. A published pattern index (`drafts/pattern-index.md`) is maintained by the `/publish` command and consumed by `/draft` to propose related patterns. **Local-first workflow:** proto-patterns and annotated drafts live in `_local/` (gitignored); clean drafts are exported to `drafts/patterns/` for commit.

## Key Constraints

- **Pattern template is authoritative.** `docs/patterns/2 - Pattern_Template.md` defines the pattern structure. The Zod schema, validation, and site templates derive from it.
- **Schema is code-level truth.** `src/content.config.ts` Zod schemas are what validation actually checks. They must faithfully implement the pattern template.
- **Extraction before elaboration.** AI must distinguish extracted content from generated content.
- **Source sensitivity.** Source documents stay in `_sources/` (gitignored) or Sharepoint. Never commit them. Use `source_ref` for human-readable provenance only. EXTRACTED annotations use pointers to text renditions — never embed quoted source text in draft files. Interview transcript filenames must be anonymised (date-based, no participant names).
- **Local-first extraction.** Proto-patterns (`_local/protopatterns/`) and annotated drafts (`_local/drafts/`) are gitignored. Nothing with `ptr:` annotations or source-derived content is ever committed. Clean drafts are exported to `drafts/patterns/` after annotation stripping.
- **Never commit to master.** All pattern content changes (drafts, published patterns) must be committed on a feature branch, never directly to `master`. The `/export` and `/publish` commands enforce this with a branch gate — do not bypass it.

## Commands

```bash
npm run dev          # Astro dev server
npm run build        # Production build
npm run validate     # Schema validation
```

## Git Workflow

Feature branches → PR to `master` → CI (validate + build) → merge → auto-deploy. Branch naming: `feature/{type}-{slug}`.

## AI Authorship Commands

- **`/extract`** — Mine proto-patterns from source documents. Identifies candidate patterns, matches against existing proto-patterns, creates or updates lightweight evidence files in `_local/protopatterns/` (gitignored).
- **`/draft`** — Create a full pattern draft. Four stages: classify → extract → elaborate → validate. Accepts either a source document (from `_sources/`) or a proto-pattern (from `_local/protopatterns/`). Reads `drafts/pattern-index.md` during elaboration to propose related patterns. Purely local — annotated draft to `_local/drafts/` (gitignored), no git operations.
- **`/export`** — Export a verified draft for commit. Branch gate (creates feature branch if on master), annotation check (halts if annotations remain), strip residual markers, copy clean file to `drafts/patterns/`, verify, offer to commit.
- **`/publish`** — Validate a draft and move it from `drafts/patterns/` to `src/content/patterns/`. Pre-flight annotation check blocks if annotations remain (directs operator to `/export`). Checks: schema validation, annotation removal, section completeness, URL verification, quality review. On success, appends the pattern to the published pattern index (`drafts/pattern-index.md`).
- **`/update`** — Edit a published pattern in-place. Accepts file path or pattern ID. Operator-directed edits are unannotated; model-generated substantive content uses `[ELABORATED | basis: "..."]` annotations. Exit gate enforces schema validation, section completeness, and annotation review. Syncs `drafts/pattern-index.md` and cross-references on change.

### Workflow

**Via proto-patterns (incremental):** source docs → `/extract` → proto-patterns in `_local/protopatterns/` → `/draft` → annotated draft in `_local/drafts/` → review & strip annotations → `/export` → clean draft in `drafts/patterns/` → `/publish` → production.

**Direct drafting:** source doc in `_sources/` → `/draft` → annotated draft in `_local/drafts/` → review & strip annotations → `/export` → clean draft in `drafts/patterns/` → `/publish` → production.

**Post-publication:** `/update` for in-place editing of published patterns with selective annotation and index/cross-reference maintenance.

Draft annotations use structured syntax: `[EXTRACTED | source: "..." | ptr: "_sources/file.txt:start:end" | basis: "short description"]` and `[ELABORATED | basis: "..."]`. EXTRACTED annotations use pointers to text renditions in `_sources/` — no quoted source text is embedded in drafts. All annotations must be removed before publishing or finishing an update.

The original skill definition (`tools/claude-skill.md`) is archived as reference.
