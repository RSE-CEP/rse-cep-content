# Pattern Typology for RSE in HASS & Indigenous Research

## Introduction

Pattern languages benefit from explicit typology — a classification of patterns by the kind of concern they address. Without typology, a flat collection of patterns obscures important differences: a pattern describing how to instrument OpenTelemetry spans operates at a fundamentally different level than one describing how to structure community-delegated access control, one specifying how a search interface should behave for historians working with digitised newspapers, or one describing how to run a culturally appropriate consultation process for Indigenous data governance.

Typology helps practitioners navigate the collection, understand cross-pattern relationships, and apply patterns at the right level of abstraction. It also guides extraction: a single source document frequently yields patterns at multiple levels simultaneously.

## The Four Types

### Implementation (I)

**Definition:** Implementation patterns address specific technologies, tools, libraries, and engineering techniques. They describe *how* to build something concrete.

**Characteristics:**
- Name specific technologies, frameworks, or protocols
- Provide concrete technical guidance (configuration, integration, deployment)
- Solution sections describe practical engineering approaches
- Implementation Examples show real code, configuration, or system setups
- Transferable across research domains when the technology is shared

**HASS Engineering Examples:**
- RO-Crate packaging for research data (JSON-LD metadata, schema.org vocabularies)
- Git-based version control adapted for research workflows
- OpenTelemetry instrumentation for RAG pipeline observability
- BM25 + dense vector hybrid search with Reciprocal Rank Fusion
- Configuring Claude Code for AI-assisted content authoring (CLAUDE.md conventions, slash commands, prompt templates)
- LLM provider integration for research applications (API configuration, model selection, token management)

### Architectural (A)

**Definition:** Architectural patterns describe system shapes, structural principles, data models, and the structural relationships between components. They describe *what* to build and how components relate, without prescribing specific technologies.

**Characteristics:**
- Technology-agnostic — describe principles and structures, not products
- Solution sections describe structural relationships and design principles
- Often embody ethical frameworks (FAIR, CARE, OCAP) in system design
- May reference companion Implementation patterns for concrete realisation
- Consequences sections emphasise systemic trade-offs (governance, sustainability, trust)

**HASS Engineering Examples:**
- Community-delegated access control (tiered sensitivity, elder-mediated verification)
- Multi-provider LLM abstraction (provider-agnostic interface design enabling model swapability)
- Swappable research corpus architecture (corpus-agnostic RAG core)
- Anonymised research telemetry with layered privacy controls
- Structuring systems for AI-generated component auditability (separation of generated code, verification boundaries, regeneration-safe module interfaces)

### Design (D)

**Definition:** Design patterns address the design of the digital artefact — the platform, tool, or system — from the perspective of the people who will use it and the purposes it must serve. They describe *what the thing should be like*: how it should behave, what it should present, how it should handle the needs and expectations of its users. Specifications are Design artefacts — they articulate what is to be built in terms that bridge architectural structure and human experience.

**Characteristics:**
- Focus on the artefact as experienced by users — interaction design, information architecture, behaviour, presentation
- Solution sections describe how the artefact should work from the user's and stakeholder's perspective
- Address cultural appropriateness, accessibility, and domain-specific expectations for the artefact
- Specifications and design documents are the primary expression of Design patterns
- May inform Architectural patterns (the design drives structural requirements) and be realised by Implementation patterns (the design is implemented with specific technologies)
- Consequences sections emphasise usability, appropriateness, fitness for purpose, and the relationship between design choices and research outcomes

**HASS Engineering Examples:**
- Culturally appropriate interface design for Indigenous language archives (how the artefact presents culturally sensitive material, respects access expectations, and reflects community values in its behaviour)
- Search interface design for historians working with digitised newspaper corpora (faceting, date handling, OCR confidence indicators, result presentation)
- Specification patterns for AI-assisted development (how to write specs that effectively communicate design intent to AI coding agents — what to specify, what to leave to implementation, how to express constraints and acceptance criteria)
- Designing research tools for mixed technical literacy (progressive disclosure, sensible defaults, escape hatches for power users)

**What Design is not:** Design patterns do not address how the development team organises its work, how stakeholders are consulted, or how the AI-assisted engineering workflow operates. Those concerns belong in Process patterns. The spec is a Design artefact; the workflow that uses the spec is a Process. Similarly, Design does not prescribe system structure (Architectural) or name specific technologies (Implementation), though it frequently drives both.

### Process (P)

**Definition:** Process patterns address how research software work gets done in practice: stakeholder engagement, consultation and governance workflows, communication between researchers and RSEs, sustainability planning, development workflows, and research methodology. They describe *how to work* — the human, relational, and procedural dimensions of building research software, including how humans work with AI tools.

**Characteristics:**
- Centre on people, relationships, workflows, and decision-making procedures
- Solution sections describe practices, protocols, or workflows rather than system components or artefact behaviour
- Often involve cultural context, trust-building, power dynamics, or disciplinary norms
- May be informed by Design patterns (a spec is a Design artefact used by the Process) and may drive Architectural patterns (governance requirements shape system structure)
- Consequences sections emphasise sustainability, trust, community capacity, research validity, and the social conditions for successful research software

**HASS Engineering Examples:**
- Culturally appropriate consultation for Indigenous language archive development (who to consult, when, how consent is maintained as a living process)
- Researcher–RSE communication protocols for requirements elicitation in HASS contexts
- Sustainability planning for research software prototypes (handover, data custody, end-of-funding transitions)
- Spec-driven development with AI coding agents (the workflow: writing the spec, feeding it to the agent, reviewing generated code, iterating — how humans and AI collaborate in the development cycle)
- Inter-rater reliability workflow for AI evaluation (how evaluators are recruited, allocated, and managed; how disagreements are resolved)
- AI-assisted content authoring pipeline (the extraction-before-elaboration workflow, annotation-based provenance, human verification gates)

**What Process is not:** Process patterns do not describe system structure (Architectural), the design of the artefact itself (Design), or specific technologies (Implementation). The test: if the core contribution is a way of organising human activity around research software — engagement, governance, communication, development workflow — it is Process. The spec is Design; spec-driven development is Process.

## AI Engineering as a Cross-Cutting Concern

AI-assisted engineering generates patterns in all four types. This is a feature of the typology, not a gap — a major new development should be expressible through the existing types rather than requiring a new one.

| Type | AI Engineering Example | What it addresses |
|------|----------------------|-------------------|
| **Implementation (I)** | Configuring Claude Code for content authoring; LLM API integration; prompt template engineering | Specific tools and how to wire them up |
| **Architectural (A)** | Multi-provider LLM abstraction; structuring systems for AI-generated component auditability | System shapes that account for AI-generated or AI-assisted components |
| **Design (D)** | Specification patterns for AI-assisted development; designing artefacts whose implementation may be AI-generated | What the artefact should be like; how to express design intent in specs |
| **Process (P)** | Spec-driven development workflows; AI-assisted authoring pipelines; human-AI review cycles | How humans and AI collaborate in development |

This cross-cutting nature means that a single practitioner question about AI — e.g., "How should I build research software with AI coding tools?" — will lead them to patterns in all four types. The typology helps them find the right level: "How do I configure the tool?" (I), "How should I structure my system for this?" (A), "What should I put in my spec?" (D), "How should my workflow change?" (P).

## Prior Work

The distinction between pattern types has a long history in pattern literature:

**Buschmann et al. (POSA, 1996)** introduced a three-level hierarchy:
- **Architectural patterns** — fundamental structural organisation of software systems
- **Design patterns** — refinements of subsystems or components
- **Idioms** — low-level, language-specific patterns

**Gamma et al. (GoF, 1994)** organised design patterns by purpose (Creational, Structural, Behavioral) and scope (Class vs Object), demonstrating that even within a single level, typology aids navigation.

**Alexander (1977)** organised patterns by physical scale (regions → towns → buildings → rooms → construction details), establishing the principle that patterns operate at distinct levels that reference each other.

**Coplien & Harrison (2004)** in *Organizational Patterns of Agile Software Development* extended pattern thinking to team structure, communication, and process — demonstrating that patterns can meaningfully capture human and organisational concerns with the same rigour applied to software structure.

Our typology adapts these traditions for research software engineering in HASS contexts. The key differences from classical software pattern typology:

- **Implementation** replaces "Idiom" — RSE implementation patterns are broader than language-specific idioms, encompassing tool chains, data formats, and infrastructure configuration.
- **Design** shifts from component-level software design to the *design of the research artefact* — how the platform, tool, or system should behave for its users. Specifications are the primary expression of Design patterns, particularly important in an era of AI-assisted development where the spec is the engineer's principal creative output.
- **Architectural** retains its classical meaning but extends to encompass data governance architectures, ethical framework embodiment, research data workflows, and system shapes that account for AI-generated components.
- **Process** draws on the tradition of Coplien & Harrison but scopes to research software practice: stakeholder engagement, consultation protocols, sustainability workflows, the researcher–RSE relationship, and human-AI collaboration workflows. It captures concerns that are central to HASS and Indigenous research contexts where human relationships and cultural protocols are not peripheral to the software — they are constitutive of it.

### Relationship to the Pattern Definition Guide

The Pattern Definition Guide (`docs/patterns/1 - Pattern_Definition_Guide.md`) lists five pattern types: Architectural, Design, Implementation, Process, and Organizational. Our typology activates four types for the prototype:

- **Implementation, Architectural, Design, Process** — active in this prototype
- **Organizational** (team structures, institutional collaboration models) — deferred; requires evidence from multiple institutional contexts

The distinction between Process and Organizational is important: Process patterns describe *how work gets done* and can be written from the experience of a single project or a small number of projects. Organizational patterns describe *how teams and institutions are structured* — they require multi-institutional evidence that the project does not yet have. Organizational patterns are acknowledged, not rejected, and may be added as the pattern collection matures.

## ID Conventions

Pattern IDs encode type and sequence:

```
{I|A|D|P}-NNN
```

- **Prefix:** `I` (Implementation), `A` (Architectural), `D` (Design), `P` (Process)
- **Number:** Three-digit, zero-padded, per-type sequence (I-001, I-002, ...; A-001, A-002, ...; D-001, D-002, ...; P-001, P-002, ...)
- **Single namespace:** A pattern ID is assigned at the proto-pattern stage and never changes. The directory (`drafts/protopatterns/` → `drafts/patterns/` → `src/content/patterns/`) signals lifecycle stage, not identity.

**Examples:**
| ID | Pattern | Type |
|----|---------|------|
| I-001 | Version Control for Research | Implementation |
| I-002 | RO-Crate for Research Data Packaging | Implementation |
| I-003 | Claude Code Configuration for Content Authoring | Implementation |
| A-001 | Community-Delegated Access Control | Architectural |
| A-002 | Multi-Provider LLM Abstraction | Architectural |
| D-001 | Search Interface Design for Historical Corpora | Design |
| D-002 | Specification Patterns for AI-Assisted Development | Design |
| P-001 | Culturally Appropriate Consultation for Indigenous Data | Process |
| P-002 | Spec-Driven Development with AI Coding Agents | Process |

## Section-by-Section Guidance Per Type

All patterns use the same 9 required sections. The difference is emphasis, not structure.

| Section | Implementation (I) | Architectural (A) | Design (D) | Process (P) |
|---------|-------------------|-------------------|------------|-------------|
| **Intent** | What this technology/technique achieves | What structural principle this embodies | What the artefact should be like for its users; what design problem this solves | What workflow, engagement, or governance challenge this addresses |
| **Context** | When this technology is appropriate; prerequisites include specific tools/platforms | When this system shape is appropriate; prerequisites are structural/organisational | When this design approach is appropriate; prerequisites include user needs, cultural context, or domain expectations | When this way of working is appropriate; prerequisites include stakeholder relationships, project phase, or institutional setting |
| **Issues** | Technical trade-offs (performance, compatibility, learning curve) | Systemic tensions (governance vs openness, flexibility vs consistency) | Design tensions (simplicity vs power, cultural specificity vs generality, progressive disclosure vs discoverability) | Human and procedural tensions (trust vs efficiency, inclusivity vs pace, sustainability vs innovation) |
| **Motivating Example** | A real project that hit these technical trade-offs | A real project that faced these structural tensions | A real project where these design tensions emerged | A real project where these workflow/engagement challenges arose |
| **Solution** | Names specific technologies; describes configuration, integration, deployment approaches | Describes structural principles, component relationships, data flows; technology-agnostic | Describes how the artefact should behave, what it should present, how it should handle user needs; may take the form of specification guidance | Describes practices, protocols, workflows, and engagement approaches; centres on human activity and human-AI collaboration |
| **Implementation Examples** | Real configurations, code snippets, tool setups | Real system architectures showing how principles were realised | Real designs, specs, or interface approaches that embody this pattern | Real instances of this process in practice — how a team, community, or project applied the workflow |
| **Consequences** | Concrete technical trade-offs (overhead, dependencies, lock-in) | Systemic consequences (trust, sustainability, adaptability) | Design consequences (usability, cultural appropriateness, fitness for purpose, what happens when the design is wrong) | Relational and sustainability consequences (trust built or eroded, capacity developed or extracted, long-term viability) |
| **Known Uses** | Projects using this specific technology/technique | Projects embodying this architectural approach | Projects or artefacts that embody this design approach | Projects or communities that have followed this process |
| **References** | Technology-specific citations, tools, code examples | Architectural literature, governance frameworks | Design literature, accessibility standards, domain guidelines | Process literature, community engagement resources |

## Cross-Type Relationships

Patterns frequently reference each other across types:

- **A → I references:** An Architectural pattern may list Implementation patterns that concretely realise its principles. For example, A-001 (Community-Delegated Access Control) could reference an I pattern for implementing role-based access with a specific identity provider.

- **D → A references:** A Design pattern may drive Architectural requirements. For example, a Design pattern specifying how a search interface should handle culturally sensitive material may require an Architectural pattern for tiered access control.

- **D → I references:** A Design pattern may be realised by Implementation patterns. For example, a Design pattern for progressive disclosure in research tools may be implemented with specific frontend framework patterns.

- **P → D references:** A Process pattern may use Design artefacts. The paradigmatic example: spec-driven development (Process) uses specifications (Design artefacts) as its primary input. The spec describes what the artefact should be; the process describes how you work with that spec.

- **P → A references:** A Process pattern may drive Architectural requirements. For example, a Process pattern on Indigenous data consultation may require that the system architecture support community-delegated access control — the governance process shapes the system structure.

- **Co-extraction from the same source:** A single source document (e.g., a practitioner interview) often yields patterns at multiple levels. An interviewee describing their system may simultaneously reveal an Architectural pattern (the overall access control approach), an Implementation pattern (the specific technology used), a Design pattern (how the interface presents access-controlled material), and a Process pattern (how they consulted with community stakeholders to determine access tiers). The `/extract` command is designed to handle this — candidates at different levels should be identified and typed separately.

## Classification Decision Guide

When classifying a pattern, first apply the Process pre-check, then the sequential tree.

### Pre-check: Is the core contribution human activity?

Before running the sequential steps, ask: **Is the core contribution a way of organising human activity — a workflow, consultation protocol, engagement practice, decision-making procedure, or human-AI collaboration pattern?** If yes → **Process (P)**, even if the practice involves specific technologies or system structures. The test is whether the pattern's value lies in *how people work* rather than in the technology, architecture, or artefact design that the work produces.

This pre-check is not exclusive. A single source passage often reveals both a Process pattern (the consultation workflow) and an I/A/D pattern (the system or artefact that results). Extract both as separate candidates. The pre-check prevents Process patterns from being swallowed by the sequential tree — it does not reclassify everything as Process.

### Sequential classification

For candidates not caught by the pre-check, apply in order:

1. **Does the pattern name or require specific technologies, tools, libraries, or data formats?**
   - Yes → **Implementation (I)**
   - No → continue

2. **Does the pattern describe system structure, component relationships, data flows, or governance architectures?**
   - Yes → **Architectural (A)**
   - No → continue

3. **Does the pattern describe what the artefact should be like — its behaviour, presentation, interaction design, or specification?**
   - Yes → **Design (D)**
   - No → continue

4. **Does the pattern describe workflows, stakeholder engagement, communication practices, consultation protocols, development process, or human-AI collaboration practices?**
   - Yes → **Process (P)** *(candidates reaching this step were not caught by the pre-check — reconsider whether the core contribution is human activity)*
   - No → reconsider — it may be an Organizational pattern (deferred type), or it may not be a pattern at all

**Borderline cases:**
- A pattern that describes *both* a structural principle and a specific technology is typically **Architectural** if the principle is the core contribution, or **Implementation** if the technology choice is the core contribution.
- A pattern that describes what an artefact should be like *and* how the system is structured to deliver it is typically **Design** if the user-facing behaviour is the core contribution, or **Architectural** if the system structure is the core contribution. These frequently come in pairs.
- A pattern that describes a governance *process* and a system *architecture* is typically **Process** if the human workflow is the core contribution (how people make decisions), or **Architectural** if the system structure is the core contribution (how the system enforces those decisions). Often extract both as a pair.
- A pattern that describes both a *design artefact* (what to put in a spec) and a *development workflow* (how to use that spec with an AI agent) should be split into two patterns: the spec guidance is Design, the workflow is Process.
- A practice that *uses* a specific technology is Process if the core contribution is the practice itself (when to consult, how to review, what workflow to follow); it is Implementation only if the core contribution is how to configure or deploy the tool.
- When uncertain, classify by what the practitioner would search for: "How do I build X?" → I; "How should I structure X?" → A; "What should X be like?" → D; "How should I work on X / with whom?" → P.

## References

Alexander, C., Ishikawa, S., & Silverstein, M. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Buschmann, F., Meunier, R., Rohnert, H., Sommerlad, P., & Stal, M. (1996). *Pattern-Oriented Software Architecture, Volume 1: A System of Patterns*. John Wiley & Sons.

Coplien, J. O., & Harrison, N. B. (2004). *Organizational Patterns of Agile Software Development*. Prentice Hall.

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.
