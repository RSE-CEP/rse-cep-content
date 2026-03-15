# CLAUDE.md — RSE-CEP Prototype

AI-assisted content pipeline prototype: source document extraction → structured markdown → PR/CI validation → GitHub Pages deployment.

## Documentation

- **[docs/spec.md](docs/spec.md)** — Project specification (authoritative reference)
- **[implementation_plan.md](implementation_plan.md)** — Phased build plan. Update when phases complete: mark `[x]`, add completion date, note deviations.
- **[docs/patterns/](docs/patterns/)** — Pattern content type documentation:
  - `1 - Pattern_Definition_Guide.md` — What patterns are, quality criteria, maturity levels
  - `2 - Pattern_Template.md` — **Canonical template** for pattern content. The Zod schema and site templates must reflect this structure.
  - `3 - *.md` — Worked examples (Version Control, Configuration Management)
- **[docs/ai-authorship-workflow.md](docs/ai-authorship-workflow.md)** — AI extraction process and operator workflow
- **[docs/github-actions-setup.md](docs/github-actions-setup.md)** — CI/CD setup and deployment
- **[docs/validation-script.md](docs/validation-script.md)** — Schema validation script

## Architecture

Astro + content collections. Zod schemas in `src/content.config.ts` are the single source of truth. Validation via `scripts/validate.js` (used by CI and AI skill). GitHub Actions for PR gating and deployment.

## Key Constraints

- **Pattern template is authoritative.** `docs/patterns/2 - Pattern_Template.md` defines the pattern structure. The Zod schema, validation, and site templates derive from it.
- **Schema is code-level truth.** `src/content.config.ts` Zod schemas are what validation actually checks. They must faithfully implement the pattern template.
- **Extraction before elaboration.** AI must distinguish extracted content from generated content.
- **Source sensitivity.** Source documents stay in `_sources/` (gitignored) or Sharepoint. Never commit them. Use `source_ref` for human-readable provenance only.

## Commands

```bash
npm run dev          # Astro dev server
npm run build        # Production build
npm run validate     # Schema validation
```

## Git Workflow

Feature branches → PR to `master` → CI (validate + build) → merge → auto-deploy. Branch naming: `feature/{type}-{slug}`.

## AI Authorship Commands

- **`/extract`** — Mine proto-patterns from source documents. Identifies candidate patterns, matches against existing proto-patterns, creates or updates lightweight evidence files in `drafts/protopatterns/`.
- **`/draft`** — Create a full pattern draft. Four stages: classify → extract → elaborate → validate. Accepts either a source document (from `_sources/`) or a proto-pattern (from `drafts/protopatterns/`). Outputs to `drafts/patterns/`.
- **`/publish`** — Validate a draft and move it from `drafts/patterns/` to `src/content/patterns/`. Checks: schema validation, annotation removal, section completeness, URL verification, quality review.

### Workflow

**Via proto-patterns (incremental):** source docs → `/extract` → proto-pattern(s) accumulate evidence → `/draft` from proto-pattern → draft with annotations → human review → `/publish` → production.

**Direct drafting:** source doc in `_sources/` → `/draft` → draft with annotations → human review → `/publish` → production.

Draft annotations use structured syntax: `[EXTRACTED | source: "..." | ref: ... | "quote"]` and `[ELABORATED | basis: "..."]`. All must be removed before publishing.

The original skill definition (`tools/claude-skill.md`) is archived as reference.
