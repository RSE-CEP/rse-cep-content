# /extract — Mine Proto-Patterns from Source Material

Analyse a source document in `_sources/` to identify candidate patterns, then create or update proto-pattern files in `drafts/protopatterns/`.

## Arguments

The operator should specify:
- Which source document to mine (path in `_sources/`)

## Key Principles

- **Discovery, not drafting.** This command identifies and accumulates evidence for patterns. It does not produce full pattern drafts — use `/draft` for that.
- **Freeform notes.** Proto-patterns are lightweight sketches, not structured templates. Capture evidence, quotes, and observations without forcing them into the pattern template.
- **Incremental accumulation.** Each `/extract` run may add new projects and evidence to existing proto-patterns. The value grows over multiple sources.
- **Source sensitivity.** Never include file paths, Sharepoint URLs, or identifying details about research participants. Use `source_ref` for human-readable provenance only.

## Extraction Flow

Operate in four stages. Report your progress to the operator at each stage.

### Stage 1 — Source Analysis

Read the source document from `_sources/`. Identify candidate patterns — recurring practices, solutions to common problems, named approaches, or implicit methodologies.

For each candidate, note:
- **Working name** — a descriptive label for the pattern
- **Type** — Implementation (I), Architectural (A), Design (D), or Process (P). See `docs/pattern_typology_agents.md` for the classification decision tree and borderline heuristics. Note: extracting patterns of multiple types from the same source is expected — a practitioner describing their system often reveals structural principles, specific technology choices, and workflow practices.
- **Description** — 1-2 sentences summarising what the pattern addresses
- **Exemplifying projects** — which projects in the source demonstrate this pattern
- **Key evidence** — quotes, examples, or observations that support this as a pattern

Present the candidates to the operator:

```
## Candidate Patterns

| # | Working Name | Type | Description | Projects | Strength |
|---|-------------|------|-------------|----------|----------|
| 1 | ... | I/A/D/P — [brief justification] | ... | ... | Strong/Moderate/Weak |
| 2 | ... | I/A/D/P — [brief justification] | ... | ... | Strong/Moderate/Weak |
...

Shall I proceed with all candidates, or would you like to select specific ones?
```

Wait for operator confirmation before proceeding.

### Stage 2 — Index Matching

Load `drafts/protopatterns/index.md`. For each confirmed candidate, perform semantic matching against existing proto-pattern entries:

- Compare names, descriptions, and subject matter
- A match means the candidate is describing the same pattern as an existing entry (even if the name differs)
- Consider partial overlaps — the candidate might be a sub-pattern or broader version of an existing entry

Present the match results to the operator. Include the candidate's proposed type alongside the existing entry's type to flag any consistency issues (e.g., a candidate typed as I matching an existing entry typed as A):

```
## Index Matching

| Candidate | Type | Match? | Existing Entry | Action |
|-----------|------|--------|---------------|--------|
| Pattern A | I | YES — strong match | I-003: "Similar Name" | Update existing |
| Pattern B | A | POSSIBLE — partial overlap | I-007: "Related Topic" | Operator decides |
| Pattern C | D | NO — new pattern | — | Create new |
...

Please confirm the actions, especially for partial matches.
```

Wait for operator confirmation before proceeding.

### Stage 3 — Create or Update

For each candidate, based on operator-confirmed actions:

**Creating a new proto-pattern:**
1. Assign the next available typed ID (`{I|A|D|P}-NNN`, per-type sequence from index). This is the pattern's permanent ID — it follows the pattern through draft and publication.
2. Generate a kebab-case filename from the working name
3. Create the proto-pattern file with the structure below (includes **Type** field)
4. Add an entry to `index.md` (includes Type column)

**Updating an existing proto-pattern:**
1. Read the existing proto-pattern file
2. Add new projects to the Projects section
3. Add a new source entry to the Sources table
4. Add new notes under a dated heading in the Notes section
5. Update `last_updated` and `project_count` in both the file and `index.md`

Present the proposed changes to the operator before writing.

### Stage 4 — Write and Report

Write all files (proto-pattern markdown files and updated `index.md`).

Report summary:
```
## Extraction Complete

- **Source:** [source_ref]
- **Created:** N new proto-pattern(s)
- **Updated:** N existing proto-pattern(s)
- **Total in index:** N proto-patterns

### New
- {I|A|D|P}-NNN: "Name" (type) → drafts/protopatterns/slug.md

### Updated
- {I|A|D|P}-NNN: "Name" (type) — added N projects, N notes
```

### Draft Readiness Assessment

After reporting, review **all** proto-patterns in the index (not just those touched in this run) and assess which, if any, have accumulated enough evidence for a full `/draft`. Consider:

- **Section coverage** — can the accumulated material plausibly populate most of the 9 essential pattern sections (Intent, Context, Issues, Solution, Implementation Examples, Context-Specific Guidance, Consequences, Known Uses, Related Patterns)?
- **Evidence strength** — do the notes include concrete examples, quotes, and observations that can be directly lifted into a draft, or are they mostly vague references?
- **HASS Specificity** — how well does the pattern address the needs and contexts of the relevant HASS disciplines, generic patterns exceptionally we described elsewhere are out of scope for drafting.
- **Pattern Type Specific Considerations** — for I patterns, strong implementation details and examples are crucial; for A patterns, clear architectural principles and rationale are key; for D patterns, well-articulated design decisions and trade-offs are important; for P patterns, clear workflow steps, roles, and human-AI collaboration details are essential — e.g. AI spec-driven development is a strong P candidate when the source describes how a team iterates with an agent using a spec as the shared artefact, not merely that they used AI tools.

Present the assessment:

```
### Draft Readiness

| Proto-Pattern | Type | Sources | Projects | Coverage | Ready? |
|--------------|------|---------|----------|----------|--------|
| I-001: "Name" | I | 3 | 4 | Good — most sections coverable | Yes — Strong implementation details and examples, with google technical details |
| A-001: "Name" | A | 1 | 1 | Thin — only Intent and Context | Not yet — Generic architecture lacking specificity of examples and little rationale |
...
```

Note: The "Coverage" field labels scope coverage, summarises briefly with consideration of evidence. The "Ready?" field briefly summarises HASS specificity, and pattern type specific considerations.

This is advisory only — the operator decides when to draft.

## Proto-Pattern File Structure

```markdown
# {Pattern Name}

**ID:** {I|A|D|P}-NNN
**Type:** Implementation | Architectural | Design | Process
**Description:** One or two sentences.
**Created:** YYYY-MM-DD
**Last updated:** YYYY-MM-DD

## Projects
- **{Project Name}** — how it relates (Source: {source_ref})

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| {source_ref} | YYYY-MM-DD | Brief note on what this source contributed |

## Notes
### From: {source_ref} ({date})
{Freeform notes, evidence, quotes, observations}
```

## index.md Structure

The index is a markdown file with a table. Each row is one proto-pattern:

```markdown
# Proto-Pattern Index

| ID | Type | Name | Description | File | Created | Updated | Projects |
|----|------|------|-------------|------|---------|---------|----------|
| I-001 | I | Pattern Name | Short description for semantic matching | slug.md | 2026-03-16 | 2026-03-16 | 1 |
```

When creating or updating proto-patterns, add or modify rows in this table. Keep rows sorted by ID.

## What NOT To Do

- Do not produce full pattern drafts — that is `/draft`'s job.
- Do not force proto-pattern notes into the formal pattern template structure.
- Do not commit source documents or include source file paths in output.
- Do not include identifying details about research participants.
- Do not auto-merge candidates with existing entries without operator confirmation.
- Do not skip the matching step — always check the index for existing entries.
