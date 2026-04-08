# Change Proposal: Pattern Template Simplification

## Motivation

The current pattern template (`docs/patterns/2 - Pattern_Template.md`) has grown to include sections that are process-oriented, boilerplate, or difficult to fill without AI-generated content. This undermines the project's credibility with stakeholders who are sceptical of AI-generated content, and violates an emerging core principle: **everything in a pattern should be attestable from prior experience** — interviews, project documentation, or practitioner knowledge.

This proposal trims the template to pattern-specific substance, moves boilerplate to Astro-rendered site furniture, and consolidates overlapping sections. It should be implemented **before** the externalised relationships proposal (`docs/change-proposal-externalised-relationships.md`), since that proposal also modifies the template and required sections list.

---

## Changes

### Sections Retained

These sections contain pattern-specific content that can be reliably elicited from human sources:

| Section | Rationale for keeping |
|---------|----------------------|
| **Intent** | Core purpose statement. Directly elicitable from practitioners. |
| **Context** (When applies / When not / Prerequisites) | Domain expertise. Practitioners know when a pattern fits. |
| **Issues** (forces/tensions + Key Constraints) | Central to the pattern form. Comes from real experience and interviews. |
| **Motivating Example** | Concrete story from a real project. Attestable by definition. |
| **Solution** (Core Idea, Key Principles, Solution Structure, How Issues Are Balanced) | The heart of the pattern. Domain expertise, not speculation. |
| **Implementation Examples** | Real projects with citations. Attestable. |
| **Consequences** (What You Gain / What You Accept) | Benefits and trade-offs from practitioner experience. |
| **Known Uses** | Real-world applications with citations. Attestable. |
| **References** | Pattern-specific citations, tools, and links. Human-curated. Distinct from site-level Key References (boilerplate). |

### Sections Removed

| Section | Reason for removal |
|---------|--------------------|
| **Related Patterns** | Being externalised to a data structure (see `change-proposal-externalised-relationships.md`). Rendered by Astro from `src/data/related-patterns.json`. |
| **Context-Specific Guidance** (HASS / Indigenous / Scales) | Mechanically mapping CARE sub-principles onto every pattern produces formulaic AI content. Genuine HASS/Indigenous considerations appear naturally in Context or Issues where they are real forces. The principle alignment system (see externalised relationships proposal) provides a structured, attestable way to link patterns to principles like CARE, FAIR, etc. The "For Different Scales" guidance is speculative generalisation. |
| **Common Variations** | Very difficult to elicit from interviews or documentation. In practice, this section is filled with plausible-sounding AI-generated content that cannot be attested. |
| **Pitfalls to Avoid** | The structured anti-pattern format (What happens / Why it's problematic / Instead) encourages padding. A practitioner might name one pitfall from experience, but filling multiple structured entries reliably requires AI generation. Where a genuine pitfall exists, it belongs in Consequences (What You Accept) or Context (When This Pattern Does NOT Apply). |
| **Solution: Values and Considerations** | The checkbox-style guidance (`Consider: Factor A`) overlaps with Key Principles and produces generic advice. Removing it keeps the Solution section focused. |
| **Consequences: Risks to Manage** (with mitigations) | Risk/mitigation pairs are highly tempting to fabricate. Practitioners can attest to trade-offs (kept in "What You Accept") but structured risk mitigations drift into speculation. |
| **Validation Checklist** | Process guidance, not pattern content. The pipeline handles validation. |
| **How to Contribute** | Site-level boilerplate, not pattern-specific. |
| **Citation** | Boilerplate with templated fields. Rendered by Astro. |
| **Metadata (DOI, License, Repository)** | Site-level boilerplate. Rendered by Astro. |
| **Acknowledgments** | Site-level boilerplate. Rendered by Astro. |
| **Key References** | Same foundational references (Alexander, CARE, Gamma) appear on every pattern. Move to site-level rendering. Pattern-specific references are in Resources. |
| **Pattern Metadata** (body table) | Duplicates frontmatter. Already rendered by Astro from frontmatter fields in the pattern detail page. |

### Sections Consolidated

| Change | Detail |
|--------|--------|
| **References** replaces **Resources** and absorbs **Further Reading**, **Code Examples** | Currently split across Resources (with sub-headings for Learning Materials, Code Examples, Tools, Further Reading) and a separate Key References section. The foundational references (Alexander, CARE, Gamma) move to site-level boilerplate. What remains is pattern-specific: cited works, tools, code examples, and further reading — consolidated into a single **References** section. |
| **Consequences** simplified | Remove the "Risks to Manage" sub-format. Keep "What You Gain" and "What You Accept" as the two sub-headings. Trade-offs are attestable; speculative risk mitigations are not. |
| **Solution** simplified | Remove "Values and Considerations" sub-section. Keep Core Idea, Key Principles, Solution Structure, How Issues Are Balanced. |

### Boilerplate Rendered by Astro

The pattern detail page (`src/pages/patterns/[...slug].astro`) gains site-level sections rendered below the pattern content:

| Rendered section | Source |
|-----------------|--------|
| **Key References** | Static content in the Astro component — Alexander (1977), CARE (2020), Gamma (1994), etc. Shared across all patterns. |
| **Citation** | Generated from frontmatter fields (pattern_id, title, author, last_updated). |
| **License and Repository** | Static site-level content. |
| **Acknowledgments** | Static site-level content (ARDC HASS RDC, etc.). |

These sections appear on every pattern page but are not part of the pattern markdown content. They are maintained in one place (the Astro template) and stay consistent automatically.

---

## Revised Template Structure

The new template has **9 required H2 sections** (down from the current sprawl):

```
## Intent
## Context
  ### When This Pattern Applies
  ### When This Pattern Does NOT Apply
  ### Prerequisites
## Issues
  ### Issue N: [Name]
  ### Key Constraints
## Motivating Example
## Solution
  ### Core Idea
  ### Key Principles
  ### Solution Structure
  ### How the Issues Are Balanced
## Implementation Examples
## Consequences
  ### What You Gain
  ### What You Accept
## Known Uses
## References
```

Every section is fillable from interviews, project documentation, or practitioner knowledge. Nothing requires AI elaboration to meet the template's expectations.

---

## Impact on Pipeline

### Schema (`src/schemas/pattern.js`)

Update `EXPECTED_SECTIONS` array:

```javascript
export const EXPECTED_SECTIONS = [
  'Intent',
  'Context',
  'Issues',
  'Motivating Example',
  'Solution',
  'Implementation Examples',
  'Consequences',
  'Known Uses',
  'References',
];
```

Note: this adds Motivating Example and References (previously unchecked) and removes Related Patterns, Context-Specific Guidance (both were checked). Net change: 9 → 9 sections, but a different 9.

### `/publish` skill

Update section completeness check (step 3) to match the new `EXPECTED_SECTIONS`. Remove the Related Patterns cross-reference step (step 4) — this is handled by the externalised relationships proposal.

### `/draft` skill

Update to generate content matching the simplified template structure. Fewer sections to fill means more focused extraction passes.

### `/export` skill

No changes needed — it operates on file content agnostically.

### Existing published patterns

Strip removed sections from all three published patterns (`A-004`, `I-005`, `D-002`). Since these are toy data in an experimental prototype, this is a clean delete with no legacy concerns.

### Pattern detail page (`src/pages/patterns/[...slug].astro`)

Add Astro-rendered boilerplate sections (Key References, Citation, License, Acknowledgments) below `<Content />`.

---

## Relationship to Other Proposals

This proposal should be implemented **first**. The externalised relationships proposal (`change-proposal-externalised-relationships.md`) further modifies the template and required sections by:

- Removing Related Patterns (already removed here)
- Adding Astro-rendered Related Patterns and Principle Alignments sections

After both proposals are implemented, the pattern detail page renders:
1. Frontmatter metadata table (existing)
2. Pattern content body (simplified template)
3. Related Patterns (from `related-patterns.json`) — externalised relationships proposal
4. Principle Alignments (from `principle-alignments.json`) — externalised relationships proposal
5. Key References, Citation, License, Acknowledgments (boilerplate) — this proposal

---

## Migration Plan

1. Write new pattern template (`docs/patterns/2 - Pattern_Template.md`) — see below.
2. Update `EXPECTED_SECTIONS` in `src/schemas/pattern.js`.
3. Update `/publish` skill section completeness list.
4. Update `/draft` skill to target the simplified structure.
5. Add boilerplate rendering to `src/pages/patterns/[...slug].astro`.
6. Strip removed sections from existing published patterns.
7. Update `CLAUDE.md` and `docs/implementation_plan.md`.
