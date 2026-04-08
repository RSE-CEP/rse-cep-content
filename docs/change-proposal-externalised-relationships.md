# Change Proposal: Externalised Pattern Relationships and Principle Alignments

## Motivation

The current pipeline embeds "Related Patterns" as prose inside each pattern's markdown body. This creates a **directional update problem**: when a new pattern is published that relates to three existing patterns, only the new pattern references them. The existing patterns don't learn about the new arrival unless someone manually edits each one. The `/publish` skill attempts backfill (step 4 of its current pipeline), but this approach is fragile — it parses prose to find IDs, then injects prose into other files, with no structured validation.

The fundamental issue is that **relationships are graph data stored as document content**. Moving them to a shared, external data structure means:

1. Adding a new pattern updates relationships for all affected patterns in one operation.
2. Astro renders relationships from data, not from markdown — every pattern page is always current.
3. The same architecture supports a second use case: linking architectural principles (FAIR, sustainability, etc.) to patterns with LLM-generated relevance text.

## Scope of Change

### What changes

| Area | Current | Proposed |
|------|---------|----------|
| Related Patterns in body | Prose section in markdown | Removed from template and content |
| Relationship data | Embedded in pattern markdown | `src/data/related-patterns.json` |
| Principle alignments | Does not exist | `src/data/principle-alignments.json` |
| Principle definitions | Does not exist | `src/data/principles.yml` |
| Pattern template | Includes "Related Patterns" H2 | Section removed |
| Zod schema / validation | Checks for "Related Patterns" H2 | Section removed from required list |
| Pattern detail page | Renders `<Content />` only | Renders content + structured Related Patterns + Principle Alignments components |
| `/publish` skill | Parses and backfills related patterns prose | Invokes `/relate` skill after publishing |
| New skill: `/relate` | — | Standalone skill: computes related patterns + principle alignments for a given pattern ID; calls validation tool |
| New tool | — | `scripts/update-relationships.js` — validates and merges relationship/alignment data |

### What does not change

- Pattern markdown body structure (other than removing the Related Patterns section)
- Frontmatter schema fields
- `/extract`, `/draft`, `/export` skills
- CI validation pipeline (validate.js)
- Git workflow

---

## Architecture

### 1. Data Structures

#### `src/data/related-patterns.json`

Keyed by pattern ID. Each entry lists related patterns with relationship type and rationale. Relationships are stored **bidirectionally** — when A relates to B, both entries are written.

```json
{
  "A-004": [
    {
      "related_id": "I-005",
      "relationship": "works-well-with",
      "rationale": "RO-Crate is a concrete implementation of the co-location principle this pattern describes."
    }
  ],
  "I-005": [
    {
      "related_id": "A-004",
      "relationship": "works-well-with",
      "rationale": "Co-Located Metadata and Data provides the architectural rationale that RO-Crate implements."
    }
  ],
  "D-002": []
}
```

Relationship types (matching current template sub-headings): `works-well-with`, `alternative-approach`, `typical-sequence-before`, `typical-sequence-after`.

#### `src/data/principles.yml`

A curated, human-maintained list of architectural principles the project systematically links to patterns. Kept short and deliberate — not an exhaustive catalogue.

```yaml
principles:
  - id: findable
    group: FAIR
    name: Findable
    description: >
      Data and metadata should be easy to find for both humans and computers.
      Machine-readable metadata is essential for automatic discovery.

  - id: accessible
    group: FAIR
    name: Accessible
    description: >
      Once found, data and metadata should be retrievable via standardised,
      open protocols with clear authentication and authorisation where needed.

  - id: interoperable
    group: FAIR
    name: Interoperable
    description: >
      Data should use shared vocabularies and formats so it can be combined
      with other data and work with applications or workflows for analysis,
      storage, and processing.

  - id: reusable
    group: FAIR
    name: Reusable
    description: >
      Data and metadata should be richly described with accurate provenance
      so they can be replicated and/or combined in different settings.

  - id: sustainability
    group: Sustainability
    name: Long-term Sustainability
    description: >
      Research outputs should remain usable, interpretable, and accessible
      beyond the life of the originating project, without ongoing
      infrastructure dependency.
```

This file is scaffolded with FAIR + sustainability. Additional principles are added by the operator (potentially with AI assistance in a future skill).

#### `src/data/principle-alignments.json`

Keyed by pattern ID. Each entry is an array of principle alignments with LLM-generated relevance text explaining how that specific principle applies to that specific pattern.

```json
{
  "A-004": [
    {
      "principle_id": "findable",
      "relevance": "Co-locating metadata with data ensures discovery metadata travels with the collection, making datasets findable even when moved between repositories or storage systems."
    },
    {
      "principle_id": "reusable",
      "relevance": "Self-describing packages carry the provenance and context information needed for others to understand and reuse the data without external documentation."
    },
    {
      "principle_id": "sustainability",
      "relevance": "Eliminating dependency on external metadata services means collections remain interpretable beyond the lifespan of any particular institutional system."
    }
  ]
}
```

Not every principle applies to every pattern. A single LLM call per pattern presents all principle definitions and asks the model to select only the most relevant ones (e.g. top 2–4) and write targeted relevance text for each. The model does the filtering — the goal is a short, high-signal list, not exhaustive coverage.

### 2. Validation Tool: `scripts/update-relationships.js`

A deterministic Node.js script (no LLM access) that handles structured data validation and file manipulation. It exposes two modes:

**Mode 1: Merge related patterns**

```bash
node scripts/update-relationships.js relate --input '{"A-004": [...], "I-005": [...]}' 
```

- Accepts a JSON payload of new relationship entries (output from the skill's LLM step)
- Validates the payload against a Zod schema (correct shape, valid relationship types, referenced pattern IDs exist in published patterns)
- Loads existing `src/data/related-patterns.json`
- Merges new entries (append, no duplicates by `related_id`)
- Writes back atomically
- Returns success/failure with details

**Mode 2: Merge principle alignments**

```bash
node scripts/update-relationships.js align --input '{"A-004": [...]}' 
```

- Accepts a JSON payload of principle alignment entries
- Validates against Zod schema (valid principle IDs from `principles.yml`, non-empty relevance text)
- Loads existing `src/data/principle-alignments.json`
- Merges (replace by `principle_id` per pattern, to support re-runs)
- Writes back atomically
- Returns success/failure with details

Both modes are idempotent and safe to re-run. The script owns the data files and is the only writer.

### 3. Astro Rendering

The pattern detail page (`src/pages/patterns/[...slug].astro`) gains two new rendered sections below the markdown content:

**Related Patterns section:**
- Imports `src/data/related-patterns.json`
- Filters for the current pattern's ID
- Groups by relationship type
- Renders with links to pattern pages and rationale text
- Renders nothing (no heading, no empty section) if no relationships exist

**Principle Alignments section:**
- Imports `src/data/principle-alignments.json` and `src/data/principles.yml`
- Filters for the current pattern's ID
- Renders each aligned principle with its name, group, and the relevance text
- Renders nothing if no alignments exist

Both sections are rendered by Astro components, not by markdown content. They are always current because they read from the shared data files at build time.

### 4. Skill Changes

#### `/publish` — Updated pipeline

The publish skill's current steps 3 (section completeness) and 4 (cross-reference backfill) change:

**Section completeness (step 3):** Remove "Related Patterns" from the 9 required H2 headings. The required list becomes 8 sections.

**Replace step 4 (cross-reference backfill):** Invoke the `/relate` skill (see below) with the newly published pattern's ID. This delegates all relationship and principle alignment computation to a standalone, independently testable skill.

**Step 5 (commit offer):** Now includes `src/data/related-patterns.json` and `src/data/principle-alignments.json` in the commit alongside the pattern file and index.

#### New skill: `/relate`

A standalone skill that computes related patterns and principle alignments for a given pattern ID. Independently invocable for testing, re-runs, or batch operations. `/publish` invokes it as a pipeline step; the operator can also run it directly (e.g. `/relate I-005`).

**Arguments:** A pattern ID (required). The pattern must exist in `src/content/patterns/`.

**Phase 1 — Typological pairing (focused LLM call):**

The project's pattern typology creates structural relationships: Architectural patterns describe principles that Implementation patterns concretise, and vice versa (one-to-many). This phase uses the target pattern's `pattern_type` to ask a targeted question:

- If the pattern is type A: present all published I-patterns (ID, title, summary from the index) and ask "Which of these are concrete implementations of this architecture?"
- If the pattern is type I: present all published A-patterns and ask "Which of these describe the architectural principle this pattern implements?"
- D and P patterns may have typological relationships too, but these are less structurally predictable — they are picked up in phase 2.

Output: a list of `(related_id, relationship_type, rationale_both_directions)` tuples for typological matches.

**Phase 2 — General relatedness (focused LLM call):**

Present the target pattern's content against the full published pattern index (IDs, types, keywords, HASS domains, summaries). The model uses keywords and descriptions as signal — not as a hard filter — to identify related patterns, classify relationship types, and write bidirectional rationales. Patterns already identified in phase 1 are excluded to avoid duplication.

Output: a list of additional `(related_id, relationship_type, rationale_both_directions)` tuples.

**Phase 3 — Principle alignment (focused LLM call):**

1. Read `src/data/principles.yml` for the full list of principles.
2. Read the target pattern's content.
3. In a single LLM call, present all principles and the pattern content. Ask the model to select only the most relevant principles (typically 2–4) and write a concise relevance statement for each. The goal is high-signal, targeted alignments — not exhaustive coverage.

Output: a list of `(principle_id, relevance)` tuples.

**Phase 4 — Combine and persist:**

1. Merge relationship results from phases 1 and 2. Typological relationships from phase 1 take precedence where they overlap.
2. Format both relationship and alignment results as JSON payloads.
3. Call `scripts/update-relationships.js relate --input '{...}'` to validate and merge relationships.
4. Call `scripts/update-relationships.js align --input '{...}'` to validate and merge principle alignments.
5. Report all changes to the operator.

The skill is three LLM calls with distinct, narrow questions, followed by a deterministic merge via the validation tool.

#### Batch mode: `/relate --all`

Re-runs the full `/relate` pipeline for every published pattern. Two use cases:

1. **Principle definitions changed** — `principles.yml` has been updated, all alignments need recomputing.
2. **Relationship recomputation** — e.g. after a bulk import or to regenerate all data from scratch.

This iterates over all pattern IDs in the published index and invokes the same phases for each. O(n) iterations, each with 3 LLM calls. Expected to be infrequent and operator-triggered.

---

## Template and Schema Changes

### Pattern template (`docs/patterns/2 - Pattern_Template.md`)

Remove the entire "Related Patterns" section (lines 251–268 in the current template). Add a note near the top or bottom:

```markdown
> **Note:** Related patterns and principle alignments are managed externally
> and rendered automatically on the published site. They are not part of
> the pattern content body.
```

### Required sections list

Update everywhere that enumerates required sections (publish skill, validation script if applicable):

**Before (9 sections):**
Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses, Related Patterns

**After (8 sections):**
Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses

### Existing published patterns

Delete the "Related Patterns" H2 section from all three published patterns (`A-004`, `I-005`, `D-002`). Seed `src/data/related-patterns.json` with the existing A-004 ↔ I-005 relationship (the only current bidirectional link).

---

## Migration Plan

Since this is an experimental prototype with toy data, migration is straightforward:

1. Create data files: `related-patterns.json` (seeded with A-004 ↔ I-005), `principle-alignments.json` (empty), `principles.yml` (FAIR + sustainability scaffold).
2. Build `scripts/update-relationships.js` with Zod validation for both modes.
3. Update pattern template — remove Related Patterns section.
4. Create `/relate` skill (`.claude/commands/relate.md`).
5. Update `/publish` skill — remove old step 4, invoke `/relate` instead; update section completeness (9→8 required sections).
6. Update pattern detail page — add Astro components for both new sections.
7. Strip Related Patterns sections from existing published patterns.
8. Run `/relate --all` to populate initial relationship and alignment data for existing patterns.
9. Update `docs/implementation_plan.md` and `CLAUDE.md` to reflect the new architecture.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single JSON file per data type (not per-pattern sidecars) | Atomic updates; simple Astro imports; easy to diff in PRs |
| Bidirectional storage (not computed at render time) | Explicit > implicit; LLM writes both directions with tailored rationale |
| Skill does LLM work, script does validation/merge | No additional API credentials needed; scripts stay deterministic and testable |
| YAML for principle definitions, JSON for computed data | YAML is human-friendly for hand-edited content; JSON is natural for machine-written structured data |
| Principles are a curated short list, not exhaustive | Prevents noisy, low-value alignments; operator controls what gets systematically linked |
| Render nothing when no data exists | Clean pattern pages for patterns that haven't been through the alignment process yet |
| `/relate` as standalone skill invoked by `/publish` | Independently testable and re-runnable; keeps `/publish` focused on its gate role; supports batch re-runs (`--all`) for principle definition changes |
| Decomposed LLM calls (typological → general → principles) | Each call has a narrow, focused question; avoids overloaded prompts that degrade reliability |
