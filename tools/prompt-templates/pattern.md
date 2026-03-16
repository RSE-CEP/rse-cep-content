# Pattern Prompt Template

This template defines the expected output format for AI-extracted patterns. It derives from the canonical pattern template at `docs/patterns/2 - Pattern_Template.md` and the Zod schema in `src/content.config.ts`.

## Frontmatter Fields

All pattern files must include YAML frontmatter with these fields:

```yaml
---
# Required fields
title: "Human-readable pattern title"
pattern_id: RSE-HASS-NNN        # Unique identifier
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

4. **Solution** — The configuration or approach that balances the competing issues.
   - H3: Core Idea
   - H3: Key Principles

5. **Implementation Examples** — Real examples showing how projects implemented this pattern.
   - H3: Example 1: [Project Name/Context]

6. **Context-Specific Guidance** — Guidance tailored to specific research contexts.
   - H3: For HASS Research
   - H3: For Indigenous Research (with CARE Principles Application)

7. **Consequences** — What you gain, what you accept, risks to manage.
   - H3: What You Gain
   - H3: What You Accept
   - H3: Risks to Manage

8. **Known Uses** — Real-world applications proving this pattern works.

9. **Related Patterns** — How this pattern connects to others.
   - H3: Works Well With
   - H3: Alternative Approaches

### Optional Sections

- **Motivating Example** — A concrete story illustrating the issues.
- **Common Variations** — Variations of this pattern for different contexts.
- **Pitfalls to Avoid** — Anti-patterns and common mistakes.
- **Resources** — Learning materials, code examples, tools, further reading.
- **Validation Checklist** — How to verify appropriate application.
- **Citation** — APA and BibTeX citation templates.
- **Acknowledgments** — Contributors, reviewers, communities.
- **Key References** — Foundational literature.

## Extraction Provenance Conventions

When extracting content, track provenance at the section level:

- **[EXTRACTED]** — Content directly sourced from the input document. Include a brief citation of where in the source it came from.
- **[ELABORATED]** — Content proposed by the AI to fill gaps. Clearly marked for operator review.
- **[ABSENT]** — Section where the source document provides no relevant content. Left minimal or empty for operator to fill.

## Output Path

Pattern files are written to: `src/content/patterns/{slug}.md`

Where `{slug}` is a kebab-case version of the pattern name (e.g., `named-entity-recognition-historical-newspapers.md`).
