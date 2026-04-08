# /relate — Compute Pattern Relationships and Principle Alignments

Compute related patterns and principle alignments for a given pattern ID using focused LLM calls, then persist via the deterministic validation tool.

## Arguments

**Required:** A pattern ID (e.g. `A-004`) or `--all` for batch mode.

The pattern must exist in `src/content/patterns/`. Resolve the ID against `drafts/pattern-index.md` if needed.

If `--all` is specified, iterate over every pattern ID in `drafts/pattern-index.md` and run the full pipeline for each.

---

## Setup

1. **Read the published pattern index** from `drafts/pattern-index.md` — you need all pattern IDs, types, titles, keywords, HASS domains, and summaries.
2. **Read the target pattern** from `src/content/patterns/{slug}.md` — you need the full content.
3. **Read `src/data/principles.yml`** — you need all principle definitions.

---

## Phase 1 — Typological Pairing

Use the target pattern's `pattern_type` to ask a focused structural question.

**If the target is type A (Architectural):**
Present all published I-type patterns (from the index: ID, title, summary) and ask:
> Which of these Implementation patterns are concrete implementations of this Architectural pattern? For each match, explain the relationship from both directions — why the A-pattern provides architectural grounding for the I-pattern, and why the I-pattern is a concrete implementation of the A-pattern.

**If the target is type I (Implementation):**
Present all published A-type patterns (from the index: ID, title, summary) and ask:
> Which of these Architectural patterns describe the principles this Implementation pattern concretises? For each match, explain the relationship from both directions.

**If the target is type D or P:** Skip this phase (these are picked up in Phase 2).

**Output format:** For each match, produce:
- `related_id`: the matched pattern's ID
- `relationship`: one of `works-well-with`, `alternative-approach`, `typical-sequence-before`, `typical-sequence-after`
- Two rationale strings: one from the target's perspective, one from the related pattern's perspective

---

## Phase 2 — General Relatedness

Present the target pattern's content against the full published pattern index (all IDs, types, keywords, HASS domains, summaries). **Exclude patterns already identified in Phase 1** to avoid duplication.

Ask:
> Looking at this pattern's content, keywords, and domain, which other published patterns are related? For each, classify the relationship type and write a rationale from both directions. Use keywords and descriptions as signal — not as a hard filter. Only include genuinely meaningful relationships.

Relationship types: `works-well-with`, `alternative-approach`, `typical-sequence-before`, `typical-sequence-after`.

**Output format:** Same as Phase 1.

---

## Phase 3 — Principle Alignment

Present all principle definitions from `src/data/principles.yml` alongside the target pattern's content.

Ask:
> Which of these principles are most relevant to this pattern? Select only the most relevant (typically 2–4, never more than necessary). For each, write a concise relevance statement explaining specifically how this principle applies to this pattern. The goal is high-signal, targeted alignments — not exhaustive coverage.

**Output format:** For each alignment:
- `principle_id`: the principle's ID from `principles.yml`
- `relevance`: a concise statement of how the principle applies

---

## Phase 4 — Combine and Persist

### 4a. Merge relationship results

Combine results from Phases 1 and 2. Phase 1 results take precedence if there's overlap (same `related_id`).

Format as a bidirectional JSON payload — for each relationship, create entries for BOTH the target pattern and the related pattern:

```json
{
  "A-004": [
    {
      "related_id": "I-005",
      "relationship": "works-well-with",
      "rationale": "Rationale from A-004's perspective"
    }
  ],
  "I-005": [
    {
      "related_id": "A-004",
      "relationship": "works-well-with",
      "rationale": "Rationale from I-005's perspective"
    }
  ]
}
```

Run the validation tool:

```bash
node scripts/update-relationships.js relate --input '<json payload>'
```

If validation fails, report the error and stop. Do not retry with modified data — report to the operator.

### 4b. Merge principle alignments

Format the Phase 3 results as a JSON payload:

```json
{
  "A-004": [
    {
      "principle_id": "findable",
      "relevance": "..."
    }
  ]
}
```

Run the validation tool:

```bash
node scripts/update-relationships.js align --input '<json payload>'
```

If validation fails, report the error and stop.

### 4c. Report

Report all changes to the operator:
- Number of relationships added/skipped
- Number of principle alignments added/replaced
- List each relationship and alignment for review

---

## Batch Mode (`--all`)

When invoked with `--all`:

1. Read `drafts/pattern-index.md` to get all published pattern IDs.
2. For each pattern ID, run the full pipeline (Phases 1–4).
3. Report a summary at the end: total relationships and alignments computed across all patterns.

This is expected to be infrequent and operator-triggered — e.g. after updating `principles.yml` or after a bulk import.

---

## What NOT To Do

- Do not modify pattern markdown files. This skill only writes to `src/data/` JSON files via the validation tool.
- Do not invent pattern IDs. Only reference patterns that exist in `drafts/pattern-index.md`.
- Do not create exhaustive alignments. Fewer, higher-signal alignments are better than many weak ones.
- Do not skip the validation tool. Always persist via `scripts/update-relationships.js` — never write JSON files directly.
- Do not commit. This skill computes and persists data; the calling skill (e.g. `/publish`) or operator handles git operations.
