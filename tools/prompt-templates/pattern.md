# Pattern Prompt Template

This template defines the expected output format for AI-extracted patterns. It derives from the canonical pattern template at `docs/patterns/2 - Pattern_Template.md` and the Zod schema in `src/content.config.ts`.

## Frontmatter Fields

All pattern files must include YAML frontmatter with these fields:

```yaml
---
# Required fields
title: "Human-readable pattern title"
pattern_id: I-001                # Typed ID: {I|A|D|P}-NNN
keywords:                        # At least one discovery tag
  - keyword-one
  - keyword-two
hass_domains:                    # At least one HASS discipline
  - domain-one
author: author-slug              # Team member who ran extraction and reviewed
last_updated: YYYY-MM-DD         # ISO date

# Optional fields
alternative_names:               # Other terms used in the community
  - "Alt Name 1"
version: "1.0.0"                 # Semver

# Extraction provenance (populated by AI tool)
source_type: interview-transcript  # One of: interview-transcript, talk-transcript, manual-notes, slides, mixed
source_ref: "Description of source document"
---
```

## Body Sections

The markdown body must follow the pattern template structure. Essential sections (H2 headings) are listed below. Additional sections are encouraged but optional.

### Essential Sections

1. **Intent** — One or two sentences describing the core purpose of this pattern.

2. **Context** — When this pattern applies, when it does not, and prerequisites.
   - H3: When This Pattern Applies
   - H3: When This Pattern Does NOT Apply
   - H3: Prerequisites

3. **Issues** — The conflicting requirements, principles, or values this pattern must balance. Each issue as an H3.
   - H3: Issue 1: [Name]
   - H3: Issue 2: [Name]
   - Optionally: H3: Key Constraints

4. **Motivating Example** — A concrete story illustrating the issues in a real research context.

5. **Solution** — The configuration or approach that balances the competing issues.
   - H3: Core Idea
   - H3: Key Principles
   - H3: Solution Structure
   - H3: How the Issues Are Balanced

6. **Implementation Examples** — Real examples showing how projects implemented this pattern.
   - H3: Example 1: [Project Name/Context]

7. **Consequences** — What you gain and what you accept.
   - H3: What You Gain
   - H3: What You Accept

8. **Known Uses** — Real-world applications proving this pattern works.

9. **References** — Pattern-specific citations, tools, code examples, and further reading. Foundational references (Alexander, CARE, Gamma) are rendered site-wide by Astro and do not need to be included here.

## Extraction Provenance Conventions

When extracting content, track provenance at the section level using structured annotations:

### EXTRACTED — Pointer-based source reference

```
[EXTRACTED | source: "identifier" | ptr: "_sources/filename.txt:startline:endline" | basis: "short description"]
```

| Field | Description |
|-------|-------------|
| `source` | Human-readable source identifier (safe to commit — no participant names, no identifying file paths) |
| `ptr` | Pointer to text rendition: repo-relative `.txt` file path, colon-separated start and end line numbers (1-indexed, inclusive) |
| `basis` | Short description of extracted content (~100 chars max, no quotation marks around source text). This is a summary, not a quote. |

**Rules:**
- Do not embed quoted or paraphrased source text in EXTRACTED annotations
- Record line ranges at the time of reading the source document
- Prefer generous line ranges (more context rather than less)
- A `.txt` rendition of the source must exist in `_sources/` before writing pointers

### ELABORATED — AI-generated content

```
[ELABORATED | basis: "reason for elaboration"]
```

Content proposed by the AI to fill gaps. Clearly marked for operator review.

### ABSENT

Section where the source document provides no relevant content. Left minimal or empty for operator to fill.

## Output Path

Draft pattern files are written to: `drafts/patterns/{slug}.md`

Published patterns live in: `src/content/patterns/{slug}.md`

Where `{slug}` is a kebab-case version of the pattern name (e.g., `named-entity-recognition-historical-newspapers.md`).
