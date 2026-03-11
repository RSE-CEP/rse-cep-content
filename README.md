# RSE-CEP Build Chain Prototype

AI-assisted content pipeline prototype for the CDL Research Software Engineering Capacity Enhancement Project (RSE-CEP). Source document extraction → structured markdown → PR/CI validation → GitHub Pages deployment.

**Live site:** https://ANU-HDRH.github.io/rse-cep-proto/

See [docs/spec.md](./docs/spec.md) for the full specification and [implementation_plan.md](./implementation_plan.md) for the phased build plan.

## Prerequisites

- **Node.js** >= 22.12.0 (check with `node --version`)
- **npm** (bundled with Node.js)

## Installation

```bash
git clone <repo-url>
cd rse-cep-proto
npm install
```

## Development

```bash
npm run dev          # Start Astro dev server (http://localhost:4321)
npm run build        # Production build to dist/
npm run preview      # Preview the production build locally
npm run validate     # Run schema validation against content files
```

## Project Structure

```
rse-cep-proto/
├── src/
│   ├── content.config.ts          # Zod schemas (single source of truth)
│   ├── content/
│   │   └── patterns/              # Pattern markdown files
│   └── pages/                     # Astro page templates
├── scripts/
│   └── validate.js                # Frontmatter validation script (Phase 2)
├── docs/                          # Project documentation
│   ├── spec.md                    # Authoritative specification
│   └── patterns/                  # Pattern template and examples
├── _sources/                      # GITIGNORED — local source documents
├── astro.config.mjs               # Astro configuration
├── package.json
└── tsconfig.json
```

## Content Authoring

Pattern files live in `src/content/patterns/` as Markdown with YAML frontmatter. The frontmatter schema is defined in `src/content.config.ts` and validated by Astro's content collections.

Required frontmatter fields:

| Field | Type | Description |
|---|---|---|
| `title` | string | Pattern title |
| `pattern_id` | string | Unique ID (e.g. `RSE-HASS-001`) |
| `keywords` | string[] | Discovery tags |
| `hass_domains` | string[] | Relevant HASS disciplines |
| `author` | string | Author identifier |
| `last_updated` | date | ISO date |

Optional fields: `alternative_names`, `version`, `source_type`, `source_ref`, `confidence`.

The markdown body follows the pattern template structure defined in [docs/patterns/2 - Pattern_Template.md](./docs/patterns/2%20-%20Pattern_Template.md).

## Architecture

- **Astro** with content collections for static site generation
- **Zod** schemas in `src/content.config.ts` as the single source of truth for content validation
- **GitHub Actions** for PR gating (schema + build) and GitHub Pages deployment
- **AI extraction tooling** (Claude skill) for source document → pattern conversion
