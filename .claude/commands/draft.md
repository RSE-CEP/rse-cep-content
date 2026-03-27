# /draft — AI-Assisted Pattern Drafting

Create a full structured pattern draft from either a source document in `_sources/` or a proto-pattern in `_local/protopatterns/`. The annotated draft is written to `_local/drafts/` (gitignored). A clean version is exported to `drafts/patterns/` for commit after the operator verifies and strips annotations.

## Arguments

The operator should specify one of:
- **Source document mode:** A source document path in `_sources/`, plus optional focus guidance and target pattern type (I/A/D/P)
- **Proto-pattern mode:** A proto-pattern file path in `_local/protopatterns/` (type and ID are inherited from the proto-pattern)
- Optional `pattern_id` and `author` (will be prompted if not provided)

## Input Modes

### From Source Document (direct)

When given a path in `_sources/`, operate exactly as described in the Extraction Flow below. This is the original single-source drafting workflow.

### From Proto-Pattern

When given a path in `_local/protopatterns/`, use the accumulated material in the proto-pattern file as the primary source for the 4-stage flow:

1. **Read the proto-pattern file.** It contains projects, sources, and freeform notes accumulated across multiple `/extract` runs.
2. **Resolve source files.** Read the `**Source files:**` field from the proto-pattern metadata. This lists the `_sources/` paths needed for `ptr:` annotations. **Error early if any listed file does not exist in `_sources/`** — report the missing file(s) and stop.
3. **Treat accumulated notes as the source material.** The Notes section contains evidence from multiple sources — use all of it.
4. **Read the original source documents** listed in the `Source files:` field. These are needed to create accurate `ptr:` annotations with line numbers during Stage 4.
5. **Proceed through the 4-stage flow** as normal, using the proto-pattern's accumulated material and the resolved source files for `ptr:` references.
5. **After successful draft creation,** clean up the proto-pattern:
   - Remove the entry from `_local/protopatterns/index.md`
   - Delete the proto-pattern file
   - This is mandatory — a drafted proto-pattern must not remain in the index. Report the cleanup to the operator.

## Authoritative References

Before starting, read these files to understand the expected output format:

1. **`docs/patterns/2 - Pattern_Template.md`** — The canonical pattern template. Your output must follow this structure.
2. **`src/content.config.ts`** — The Zod schema defining required and optional frontmatter fields (including `pattern_type` and typed `pattern_id`).
3. **`docs/pattern_typology_agents.md`** — Pattern type definitions, classification decision tree, and borderline heuristics for agents. For detailed section-by-section guidance per type, see `docs/pattern_typology.md`.
4. **`tools/prompt-templates/pattern.md`** — Quick reference for frontmatter fields, body sections, and provenance conventions.
5. **`docs/patterns/1 - Pattern_Definition_Guide.md`** — What patterns are, quality criteria, how they differ from best practices/principles/tutorials.

For a worked example, see: `src/content/patterns/version-control-for-research.md`

## Key Principles

- **Extraction before elaboration.** Always distinguish what comes from the source document versus what you generate to fill gaps.
- **Patterns are not prescriptive recipes.** They describe issues and solutions, providing guidance and principles rather than step-by-step instructions.
- **"Issues" not "Problems".** Use the project's inclusive terminology — issues may be requirements, principles, goals, challenges, or technical problems.
- **Source sensitivity.** Never include file paths, Sharepoint URLs, or identifying details about research participants in the output. Use `source_ref` for human-readable provenance only.
- **Schema is law.** The Zod schema in `src/content.config.ts` determines what passes validation. Your output must conform to it.

## Pre-flight: Branch Gate

**This gate is mandatory. Do not skip it. Do not proceed to Stage 1 until it passes.**

Check the current branch:

```bash
git branch --show-current
```

**If on `master`:** Do not proceed. Create a feature branch before continuing:

1. Check the state of local master against origin:
   ```bash
   git fetch origin master && git rev-list --left-right --count origin/master...HEAD
   ```
   - **Right > 0** (unpushed local commits): Warn the operator — "Local master has N unpushed commit(s). Push them before branching to avoid a divergent master." Do not proceed until resolved.
   - **Left > 0** (behind origin): Warn and offer to run `git pull --rebase origin master`.
   - **Both 0**: Proceed.

2. Determine the branch name. If the pattern slug is already known (e.g., from a proto-pattern), use `feature/pattern-{slug}`. Otherwise use a temporary name like `feature/draft-wip` and rename later.

3. Create and switch to the feature branch:
   ```bash
   git checkout -b feature/pattern-{slug}
   ```

4. Report to the operator: "Created feature branch `feature/pattern-{slug}`. Proceeding with drafting."

**If already on a feature branch:** Proceed silently.

**If on any other non-master branch:** Proceed, but note the branch name to the operator.

**Note:** The branch gate exists for the Export Gate (Stage 5), which commits the clean draft to `drafts/patterns/`. The annotated draft in `_local/drafts/` is gitignored and never committed.

---

## Extraction Flow

Operate in five stages. Report your progress to the operator at each stage.

### Stage 1 — Source Classification and Type Confirmation

Read the source document(s) provided by the operator. Characterise the input:

| Source Type | Characteristics | Extraction Strategy |
|---|---|---|
| `interview-transcript` | Structured by questions, rich contextual detail | Extract directly from answers, use questions for section mapping |
| `talk-transcript` | Narrative flow, may reference slides | Restructure narrative into template sections |
| `manual-notes` | Sparse, telegraphic | More elaboration needed, flag gaps prominently |
| `slides` | Fragmentary claims, bullet points | Significant elaboration needed, low confidence |
| `proto-pattern` | Accumulated evidence from multiple sources | Rich multi-source material, cross-reference evidence |
| `mixed` | Combination of the above | Adapt per-section |

**Type confirmation:**
- **From a typed proto-pattern:** Carry forward the type (I/A/D/P) and ID from the proto-pattern file. Report to the operator: "This proto-pattern is typed as [type] with ID [ID]. Proceeding with this classification."
- **From a source document:** Propose a pattern type (I/A/D/P) using the classification decision tree in `docs/pattern_typology_agents.md`. Report to the operator and wait for confirmation.
- **Type mismatch guard:** If the proto-pattern has an assigned type but the operator requests a different type, warn: "This proto-pattern is typed as [X] but you've requested [Y]. The ID will remain [ID] (assigned at proto-pattern stage). Confirm?" The ID never changes once assigned.

Report the classification and type to the operator before proceeding.

### Stage 2 — Template-Aware Extraction

Extract content from the source into the pattern template structure. **Consult the section-by-section guidance table in `docs/pattern_typology.md`** to understand how each section should be emphasised for this pattern's type (I/A/D/P). For each section:

1. **Map source content to template sections.** Find passages in the source that correspond to Intent, Context, Issues, Solution, etc. Use the type-specific guidance to determine what emphasis each section should have.
2. **Extract faithfully.** Use the source's own language and ideas. Restructure for clarity but do not invent content.
3. **Track provenance.** For each section, note whether it was:
   - **EXTRACTED** — Content directly from the source
   - **THIN** — Some relevant content exists but insufficient for a complete section
   - **ABSENT** — No relevant content in the source for this section

Present the extraction results to the operator as a structured report before proceeding:

```
## Extraction Report

### Frontmatter
- title: [proposed] — [source/elaborated]
- pattern_id: [proposed] — [needs operator input]
...

### Body Sections
| Section | Status | Source Location |
|---|---|---|
| Intent | EXTRACTED | Q2 response, paragraphs 3-4 |
| Context | EXTRACTED | Q1 and Q5 responses |
| Issues | THIN | Mentioned in Q3 but not elaborated |
...
```

### Stage 3 — Guided Elaboration

For sections marked THIN or ABSENT, propose content to fill the gaps. Clearly mark all elaborated content.

Present elaboration proposals to the operator. Wait for the operator to accept, reject, or modify each proposal before proceeding. If the operator instructs you to proceed without review, combine accepted defaults and continue.

#### Related Pattern Proposals

After elaboration, read `drafts/pattern-index.md` to propose entries for the Related Patterns section. If the file is missing or contains no data rows, skip this step and report to the operator: "No published patterns in the index — skipping related pattern proposals." **Do NOT write this message into the pattern file.** The Related Patterns section should be left empty (with just the `## Related Patterns` heading) if there are no proposals — never include operator status messages in the pattern body.

If the index has entries, match the draft pattern against published patterns using:
- Shared keywords or HASS domains
- Type relationships (e.g., an Implementation pattern that implements an Architectural pattern)
- Semantic relevance of summaries (does this pattern complement, sequence with, or offer an alternative to a published pattern?)

Present a table of proposed related patterns:

```
## Related Pattern Proposals

| Published Pattern | Relationship | Rationale |
|-------------------|-------------|-----------|
| I-001: Version Control for Research | Works Well With | Both address research data management workflows |
| A-001: Community Access Control | Typical Sequence | Access control is often established before ... |
```

Relationship types:
- **Works Well With** — patterns that complement each other
- **Alternative Approaches** — patterns that address similar issues differently
- **Typical Sequence** — patterns commonly applied before or after this one

The operator confirms, rejects, or edits each proposal before inclusion in the Related Patterns section of the draft. Confirmed entries should be written into the Related Patterns body section using the pattern's title and ID, with a brief description of the relationship.

### Stage 4 — Output and Validation

1. **Compose the final markdown file.** Combine frontmatter and body sections. Frontmatter must include `pattern_type` (implementation/architectural/design/process) and a correctly-formatted typed `pattern_id`. When drafting from a proto-pattern, use the proto-pattern's existing ID. When drafting from a source document (direct mode), assign a new ID by running: `node scripts/next-pattern-id.js {type}`. The ID prefix must match the type.

2. **Ensure a text rendition exists.** Before writing any EXTRACTED annotations, confirm a `.txt` rendition of the source document exists in `_sources/`. Rules by source type:
   - `.txt` or `.md` — use the source file directly as the rendition (already plain text and line-addressable).
   - `.json` or `.yaml` / `.yml` (interview transcripts) — the operator should have already run `node scripts/interview-to-text.js <source>` to produce a `.txt` rendition. If the `.txt` is missing, run the script. The `.txt` is the source you read — not the JSON/YAML.
   - `.pdf`, `.docx`, etc. — generate a plain-text rendition (same filename stem, `.txt` extension) using available tools.
   - If a `.txt` rendition already exists, use it as-is.

3. **Use structured annotations.** All content must use the annotation syntax:
   - Extracted content: `[EXTRACTED | source: "identifier" | ptr: "_sources/filename.txt:startline:endline" | basis: "short description"]`
   - Elaborated content: `[ELABORATED | basis: "reason for elaboration"]`

   **EXTRACTED annotation rules:**
   - The `source` field is a human-readable identifier (safe to commit — no participant names, no identifying file paths).
   - The `ptr` field is a pointer to the text rendition: repo-relative path to the `.txt` file, colon-separated start and end line numbers (1-indexed, inclusive). Record line ranges at the time of reading the source — do not reconstruct them after the fact. Prefer generous ranges (more context rather than less).
   - The `basis` field is a short description of the extracted content (e.g. "participant describes multi-step validation workflow"). It is **not** a quote from the source. Keep it under ~100 characters and do not use quotation marks around source text within it.
   - **Do not embed quoted or paraphrased source text in EXTRACTED annotations.** The source content is accessible via the pointer. The `basis` field is a summary only.

   These annotations are visible inline for reviewer verification and machine-parseable for the publish workflow.

4. **Determine the output path.** Use kebab-case slug: `_local/drafts/{slug}.md`

5. **Write the file** to the local drafts directory.

6. **Run validation:**
   ```bash
   node --import tsx scripts/validate.js _local/drafts/{slug}.md
   ```

7. **If validation fails:** Read the error output, fix the issues, re-validate. Repeat until validation passes.

8. **Report status and proceed to Stage 5:**
   ```
   ## Draft Complete

   - **File:** _local/drafts/{slug}.md
   - **Source:** [source document path or proto-pattern ID]
   - **Validation:** PASS
   - **Sections extracted:** N of 9 essential sections
   - **Sections elaborated:** N sections
   - **Annotations:** N [EXTRACTED], N [ELABORATED] markers for reviewer verification
   ```

### Stage 5 — Export Gate

The draft in `_local/drafts/` contains annotations that reference the operator's local `_sources/`. Before committing, the annotations must be verified and stripped.

Present the export checklist to the operator:

```
## Export Checklist

Your annotated draft is at: _local/drafts/{slug}.md

Before committing:
[ ] Verify ptr: annotations against source files
[ ] Strip all [EXTRACTED | ...] and [ELABORATED | ...] markers
[ ] Copy clean file to drafts/patterns/{slug}.md
[ ] Commit on feature branch

Run `node scripts/check-draft.js drafts/patterns/{slug}.md` to confirm no annotations remain.
```

**If the operator asks you to perform the export:**

1. **Strip annotations.** Remove all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers from the draft content, leaving the surrounding text in place.
2. **Copy to repo.** Write the clean draft to `drafts/patterns/{slug}.md`.
3. **Verify.** Run `node scripts/check-draft.js drafts/patterns/{slug}.md` to confirm no annotations remain.
4. **Commit.** Offer to commit the clean draft on the current feature branch. Do not auto-commit without confirmation.

**If the operator wants to do it manually:** Acknowledge and end. The annotated draft remains in `_local/drafts/` for their review.

## Multiple Patterns

If the source document contains material for multiple patterns, identify them in Stage 1 and ask the operator which to draft first. Process one pattern at a time.

## What NOT To Do

- Do not commit source documents or include source file paths in output.
- Do not silently fill gaps — always use annotation syntax to flag elaborated content.
- Do not include identifying details about research participants.
- Do not skip validation — always run `scripts/validate.js` after writing.
- Do not invent Known Uses or Implementation Examples — these must be real.
- Do not add a maturity level field — maturity judgements are out of scope.
- Do not use `[square brackets]` in the pattern body except for annotation syntax (`[EXTRACTED | ...]` and `[ELABORATED | ...]`). Avoid bracket-style placeholders, labels, or diagram shorthand in prose and code blocks — use plain text, italics, or indentation instead.
