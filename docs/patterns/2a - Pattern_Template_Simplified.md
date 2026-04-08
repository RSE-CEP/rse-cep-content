# [Pattern Name]

*A descriptive, memorable name that captures the essence of the pattern*

**Alternative Names:** *Other terms used in the community*

> **Note:** Related patterns, principle alignments, foundational references, citation blocks, licensing, and acknowledgments are managed externally and rendered automatically on the published site. They are not part of the pattern content body.

---

## Intent

*One or two sentences describing the core purpose of this pattern.*

---

## Context

### When This Pattern Applies

*The situation or environment where this pattern is relevant:*
- Research domain and typical project types
- Team composition and capabilities
- Scale considerations (project size, data volume)

### When This Pattern Does NOT Apply

*Situations where this pattern should not be used:*
- Condition 1
- Condition 2

### Prerequisites

*What should be in place before applying this pattern:*
- Prerequisite 1
- Prerequisite 2

---

## Issues

*The conflicting requirements, principles, or values this pattern must balance. An issue may be a requirement (e.g. FAIR, CARE), a principle (e.g. data sovereignty, open science), a goal (e.g. reproducibility), a challenge (competing values), a need (user requirement), or a technical problem. These are contextual issues to balance.*

### Issue 1: [Name]

- Description of this concern
- Why it matters in research contexts
- Who is affected

### Issue 2: [Name]

- Description of this concern
- Why it matters in research contexts
- Who is affected

### Key Constraints

*Boundaries that shape the solution space:*
- Constraint 1 (technical, ethical, legal, organizational)
- Constraint 2

---

## Motivating Example

*A concrete story that illustrates the issues in a real research context.*

**The Situation:**
*Describe the research project and circumstances*

**The Issues That Emerged:**
*What competing concerns arose in this context?*

**Why Balance Is Needed:**
*What makes these issues difficult to reconcile?*

---

## Solution

### Core Idea

*Describe the configuration or approach that balances the competing issues. Focus on principles and structure, not prescriptive steps (Alexander, 1979).*

### Key Principles

*Guiding principles that define this solution:*

1. **Principle 1:** Description
2. **Principle 2:** Description
3. **Principle 3:** Description

### Solution Structure

*Visual representation of the pattern:*

```
[Simple diagram showing:]
- Key components or aspects
- Relationships between them
- Flow of responsibility or interaction
```

### How the Issues Are Balanced

*Explicitly show how the solution addresses each issue:*

- **Issue 1** is balanced by: [How this configuration addresses it]
- **Issue 2** is balanced by: [How this configuration addresses it]

---

## Implementation Examples

*Multiple examples showing how different projects have implemented this pattern.*

### Example 1: [Project Name/Context]

**Context:** Brief description of the project and domain

**How They Balanced the Issues:**
*Summary of their approach and key decisions*

**What Worked Well:** Brief outcome note

**Link to Details:** [URL to full case study, code repository, or documentation]

### Example 2: [Project Name/Context]

**Context:** Brief description showing different context

**How They Balanced the Issues:**
*Summary emphasizing different approach to same pattern*

**What Worked Well:** Brief outcome note

**Link to Details:** [URL to full case study, code repository, or documentation]

---

## Consequences

### What You Gain

- Benefit 1
- Benefit 2
- Benefit 3

### What You Accept

- Trade-off 1: What you give up and why
- Trade-off 2: What you give up and why

---

## Known Uses

*Real-world applications proving this pattern works in practice (Gamma et al., 1994).*

### Project 1: [Name]

- **Institution/Domain:** Brief context
- **How They Used It:** One-sentence summary
- **Link:** [URL to project, paper, or case study]

### Project 2: [Name]

- **Institution/Domain:** Brief context
- **How They Used It:** One-sentence summary
- **Link:** [URL to project, paper, or case study]

---

## References

*Pattern-specific citations, tools, code examples, and further reading. Foundational references (Alexander, CARE Principles, etc.) are rendered site-wide and do not need to be repeated here.*

- Citation 1: [Full citation with DOI/URL]
- Citation 2: [Full citation with DOI/URL]
- Tool or code example: [Description and URL]

---

**Template Version 2.0**
**Developed by:** CDL RSE Capacity Enhancement Project
**License:** CC BY 4.0

---

# Template Change Log: v1.0 to v2.0

## Design Principle

**Everything in a pattern must be attestable from prior experience.** If a section cannot be reliably filled from interviews, project documentation, or practitioner knowledge, it does not belong in the pattern content. AI-generated content that sounds plausible but cannot be verified against real experience undermines the credibility of the pattern collection.

## Sections Retained (with rationale)

| Section | Why it stays |
|---------|-------------|
| **Intent** | Core identity of the pattern. A practitioner can always articulate this. |
| **Context** | Practitioners know when a pattern applies and when it doesn't. Directly elicitable. |
| **Issues** | Central to the pattern form (Alexander's "forces"). Comes from real tensions observed in practice. |
| **Motivating Example** | A concrete story from a real project. Attestable by definition — it happened. |
| **Solution** (Core Idea, Key Principles, Structure, Issue Balance) | The heart of the pattern. Requires domain expertise, not AI elaboration. |
| **Implementation Examples** | Real projects with citations. Either it happened or it didn't. |
| **Consequences** (Gains + Trade-offs) | Practitioners can attest to what worked and what they gave up. |
| **Known Uses** | Real-world applications with citations. Verifiable. |
| **References** | Human-curated citations, tools, and links specific to this pattern. |

## Sections Removed (with rationale)

| Section | Why it was removed |
|---------|--------------------|
| **Related Patterns** | Externalised to a shared data structure (`src/data/related-patterns.json`). Rendered by Astro from structured data, enabling bidirectional relationships that update automatically when new patterns are published. See `docs/change-proposal-externalised-relationships.md`. |
| **Context-Specific Guidance** (HASS / Indigenous / Scales) | The structured CARE Principles mapping produced formulaic AI content when applied mechanically to every pattern. Genuine domain-specific considerations belong in Context or Issues, where they are real forces — not in a separate section that invites template-filling. The new principle alignment system (`src/data/principle-alignments.json`) provides a structured, attestable way to link patterns to principles like CARE and FAIR. "For Different Scales" was speculative generalisation. |
| **Common Variations** | Very difficult to elicit from human sources. In practice, filled with plausible AI-generated content that cannot be attested from experience. |
| **Pitfalls to Avoid** | The anti-pattern format (What happens / Why / Instead) encouraged padding beyond what practitioners could attest. Genuine pitfalls belong in Consequences (What You Accept) or Context (When This Pattern Does NOT Apply). |
| **Solution: Values and Considerations** | Overlapped with Key Principles. The checkbox format produced generic guidance rather than pattern-specific insight. |
| **Consequences: Risks to Manage** | Risk/mitigation pairs are highly tempting to fabricate. Practitioners can attest to trade-offs (kept) but structured risk mitigations drift into speculation. |
| **Validation Checklist** | Process guidance. The pipeline handles validation. |
| **How to Contribute** | Site-level information, not pattern content. |
| **Citation** | Boilerplate with templated fields. Now rendered by Astro from frontmatter. |
| **Metadata (DOI, License, Repository)** | Site-level boilerplate. Now rendered by Astro. |
| **Acknowledgments** | Site-level boilerplate. Now rendered by Astro. |
| **Key References** | The same foundational references (Alexander, CARE, Gamma) appeared on every pattern. Now rendered site-wide by Astro. Pattern-specific citations are in References. |
| **Pattern Metadata** (body table) | Duplicated frontmatter fields already rendered by Astro in the pattern detail page. |

## Sections Consolidated

| Change | Detail |
|--------|--------|
| **References** replaces **Resources** + **Further Reading** + **Key References** | Foundational references move to site-level boilerplate. Everything pattern-specific (citations, tools, code examples, further reading) consolidates into one section. |
| **Consequences** simplified | Removed "Risks to Manage" sub-format. Kept "What You Gain" and "What You Accept" — attestable from experience. |
| **Solution** simplified | Removed "Values and Considerations" sub-section. Kept Core Idea, Key Principles, Solution Structure, How Issues Are Balanced. |
