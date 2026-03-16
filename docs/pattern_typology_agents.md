# Pattern Typology — Agent Reference

This document is a condensed reference for AI agents operating in the RSE-CEP authorship pipeline. For the full rationale, prior work, and section-by-section guidance, see the Pattern Typology document.

## Four Active Types

**Implementation (I)** — *How to build it.*
Names specific technologies, tools, libraries, data formats, or protocols. Provides concrete technical guidance: configuration, integration, deployment. If the pattern stops being useful when you swap the technology, it's Implementation.

**Architectural (A)** — *How to structure it.*
Technology-agnostic system shapes: component relationships, data flows, structural principles, governance architectures. Describes what to build and how parts relate, not what tools to use. If you could implement it in multiple tech stacks and the pattern still holds, it's Architectural.

**Design (D)** — *What should the artefact be like.*
The design of the digital artefact from the perspective of its users and purposes. Interaction design, information architecture, behaviour, presentation, cultural appropriateness of the thing being built. Specifications are Design artefacts — they express what is to be built in terms that bridge structure and human experience.

**Process (P)** — *How to work.*
Workflows, stakeholder engagement, consultation protocols, development practices, human-AI collaboration, research methodology, sustainability planning. Centres on human activity and how people (and AI agents) organise their work. The spec is Design; spec-driven development is Process.

**Organizational (O)** — *Deferred.* Team structures and institutional models. Requires multi-institutional evidence not yet available.

## Classification Decision Tree

### Step 0 — Process pre-check

Before applying the sequential tree, ask: **Is the core contribution a way of organising human activity — a workflow, consultation protocol, engagement practice, decision-making procedure, or human-AI collaboration pattern?** If the answer is yes, classify as **Process (P)** — even if the practice involves specific technologies or system structures. The test is whether the pattern's value lies in *how people work* rather than in the technology, architecture, or artefact design that the work produces.

This does not mean every mention of a workflow is Process. A pattern that describes a governance *architecture* (how a system enforces access tiers) is Architectural even if a human workflow feeds into it. The pre-check catches patterns whose core contribution is the human activity itself — the consultation protocol, the review workflow, the collaboration practice.

**Important:** A single source passage often contains both a Process pattern and an I/A/D pattern. The pre-check is not exclusive — if the same material reveals both a consultation workflow (P) and a system architecture that implements the governance decisions (A), extract both as separate candidates. The goal is to stop Process patterns from being swallowed by the sequential tree, not to reclassify everything as Process.

### Steps 1–5 — Sequential classification

For candidates not caught by the pre-check, apply in order. Stop at the first match.

1. Does it name or require specific technologies, tools, or data formats? → **I**
2. Does it describe system structure, component relationships, or data flows? → **A**
3. Does it describe what the artefact should be like — behaviour, presentation, interaction, specification? → **D**
4. Does it describe workflows, engagement, communication, development process, or human-AI collaboration? → **P** *(candidates reaching this step were not caught by the pre-check — reconsider whether the core contribution is human activity)*
5. None of the above → flag as unclassified. It may be Organizational (deferred) or not a pattern.

## Borderline Heuristics

- **Structural principle + specific technology:** Architectural if the principle is the core contribution; Implementation if the tech choice is.
- **Artefact behaviour + system structure:** Design if the user-facing behaviour is the point; Architectural if the system shape is the point. Often a pair.
- **Governance process + system architecture:** Process if it's about how people decide; Architectural if it's about how the system enforces. Often extract both as a pair.
- **Spec content + development workflow:** Split them. What goes in the spec → Design. How you use the spec with an AI agent → Process.
- **Evaluation criteria + evaluation workflow:** What counts as quality → Design (if about the artefact) or Process (if about research methodology). How you run the evaluation → Process.
- **Practice that uses a technology:** If the core contribution is the practice (when to consult, how to review, what workflow to follow), it is Process even if a specific tool is named. The tool is incidental; the practice is the pattern. If the core contribution is how to configure or deploy the tool, it is Implementation.

**Quick test:** What would the practitioner search for?
- "How do I build X?" → I
- "How should I structure X?" → A
- "What should X be like?" → D
- "How should I work on X / with whom?" → P

## Cross-Type Relationships

When extracting, a single source often yields patterns at multiple levels. Flag each separately.

- **A → I:** Architecture references implementations that realise it.
- **D → A:** Design drives architectural requirements (e.g., access-controlled UI needs access-control architecture).
- **D → I:** Design is realised by specific technologies.
- **P → D:** Process uses design artefacts (specs) as inputs.
- **P → A:** Process (e.g., governance workflows) drives architectural requirements.

## ID Convention

```
{I|A|D|P}-NNN
```

Three-digit, zero-padded, per-type sequence. Assigned at proto-pattern stage, never changes. Directory signals lifecycle, not identity.

## AI Engineering Patterns

AI is a cross-cutting concern. Classify by what the pattern actually addresses, not by the fact that AI is involved.

| Concern | Type | Example |
|---------|------|---------|
| Tool configuration, API wiring, prompt templates | I | Claude Code setup for content authoring |
| System shapes for AI-generated components | A | Multi-provider LLM abstraction; auditability boundaries |
| What to put in a spec; artefact design when implementation is AI-generated | D | Specification patterns for AI-assisted development |
| Human-AI collaboration workflows; how to iterate with agents | P | Spec-driven development; AI-assisted authoring pipeline |
