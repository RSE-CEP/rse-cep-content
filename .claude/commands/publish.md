# /publish — Publish a Draft Pattern

Validate a draft pattern and move it from `drafts/patterns/` to `src/content/patterns/` for publication.

## Arguments

Optionally specify a draft file path. If not provided, list files in `drafts/patterns/` and ask the operator which to publish.

## Pre-flight: Branch Gate

**This gate is mandatory. Do not skip it. Do not proceed to publish checks until it passes.**

Check the current branch:

```bash
git branch --show-current
```

**If on `master`:** Do not proceed. Warn the operator: "You are on `master`. Publishing must happen on a feature branch so changes go through PR review. Create or switch to a feature branch first (e.g., `feature/publish-{slug}`)." Do not continue until the operator is on a non-master branch.

**If on a feature branch:** Proceed silently.

---

## Pre-flight: Annotation Check

Before proceeding to publish checks, run the annotation scanner on the target file:

```bash
node scripts/check-draft.js drafts/patterns/{slug}.md
```

**If annotations are detected:** Halt immediately. Report the annotation count and instruct the operator:

> This draft still contains annotations. Run `/export` to produce a clean draft first:
> 1. Review annotations in the annotated draft (`_local/drafts/{slug}.md` if available)
> 2. Strip all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers
> 3. Run `/export {slug}` to verify annotations are cleared and copy the clean file to `drafts/patterns/`
> 4. Re-run `/publish` after `/export` completes

Do not proceed to publish checks until annotations are cleared.

**If no annotations detected:** Proceed to publish checks.

---

## Publish Checks

All checks must pass before the file can be moved to production.

### 1. Schema Validation

Run the schema validator against the draft file:

```bash
node --import tsx scripts/validate.js drafts/patterns/{slug}.md
```

The file must pass all frontmatter schema checks.

### 2. Annotation Check

Run the annotation scanner to detect remaining draft markers:

```bash
node scripts/check-draft.js drafts/patterns/{slug}.md
```

**FAIL if ANY `[EXTRACTED |` or `[ELABORATED |` markers remain.** All annotations must be removed by a human reviewer before publishing. This ensures every claim has been verified against source material.

### 3. Section Completeness

Verify all 9 expected body sections are present (H2 headings):
- Intent
- Context
- Issues
- Solution
- Implementation Examples
- Context-Specific Guidance
- Consequences
- Known Uses
- Related Patterns

**FAIL if any section is missing.** This is a hard requirement for publication (unlike validation, which soft-warns).

### 4. URL Verification

Find all URLs in the draft (markdown links, bare URLs, `→ https://...` references). For each URL:

1. **Fetch the URL** using WebFetch (or curl as fallback) to confirm it resolves (HTTP 200 or redirect to 200).
2. **Verify the destination matches what the link text claims.** For example, if the link text says "CARE Principles" the page should actually be about the CARE Principles, not an unrelated page or a generic 404-styled landing page.

**Report results as a table:**

```
| URL | Status | Matches Description? | Notes |
|-----|--------|---------------------|-------|
| ... | 200    | Yes                 |       |
```

**FAIL if any URL returns a hard error (4xx, 5xx, connection failure).** Report broken URLs with their line numbers and suggest corrections or removal.

**WARN (non-blocking) if a URL resolves but the page content doesn't match what the link text claims.** The operator decides whether to fix or accept.

### 5. Quality Review

Review the draft against the pattern quality criteria from `docs/patterns/1 - Pattern_Definition_Guide.md`. Flag obvious issues:
- Empty or placeholder sections
- Sections that are just a single sentence when they should be substantive
- Content that reads like a tutorial or step-by-step guide rather than a pattern
- Missing or clearly wrong frontmatter values

**Type-content consistency check** (consult `docs/pattern_typology_agents.md`):
- **Architectural (A) pattern** naming specific technologies in the Solution section → flag: "A patterns should describe structural principles, not specific technologies. Consider whether this is better typed as Implementation."
- **Implementation (I) pattern** with no technology references in Solution or Implementation Examples → flag: "I patterns should name specific technologies. Consider whether this is better typed as Architectural or Design."
- **Design (D) pattern** describing system components rather than methodology or decision frameworks → flag: "D patterns should describe analytical approaches. Consider whether this is better typed as Architectural."
- **Process (P) pattern** describing artefact structure rather than human workflow → flag: "P patterns should describe how people and agents work together, not what artefacts they produce. Consider whether this is better typed as Design or Architectural. A strong P pattern, such as AI spec-driven development, centres on the iterative workflow between practitioners and agents, not on the spec itself."

**Source sensitivity check:** Verify that `source_ref` and body text do not name non-public individuals (especially interview participants). Interview sources should use role-based descriptions with dates (e.g. "RSE practitioner interview, 2026-03-23"). Public authors, speakers at recorded events, and published document authors may be named. Flag any potential personal names for operator confirmation.

Report quality concerns but do not block publication for them — the operator decides.

## On All Checks Passing

1. **Move the file** from `drafts/patterns/{slug}.md` to `src/content/patterns/{slug}.md`. This means: write the file to the new location, then **delete** `drafts/patterns/{slug}.md`. The draft must not remain after publishing.
2. **Run validation again** against the new location to confirm:
   ```bash
   node --import tsx scripts/validate.js src/content/patterns/{slug}.md
   ```
3. **Update the published pattern index** (`drafts/pattern-index.md`):
   - If the file doesn't exist, create it with the header row:
     ```
     # Published Pattern Index

     | ID | Type | Title | Keywords | HASS Domains | Summary |
     |----|------|-------|----------|--------------|---------|
     ```
   - Append a row for the newly published pattern. The **Summary** column should be a concise one-line description you write capturing the pattern's essence — not mechanically extracted from a field, but written for semantic matching (i.e., another agent reading this summary should be able to judge whether this pattern is related to a different pattern). Keep it under ~150 characters.
   - **Keywords** and **HASS Domains** columns should be comma-separated values from the frontmatter fields.
   - Example row: `| I-001 | Implementation | Version Control for Research | version control, git | digital humanities, archaeology | Using Git-based version control workflows adapted for HASS research outputs and collaborative authoring |`
4. **Cross-reference related patterns** in already-published pattern files:
   - Read the newly published pattern's **Related Patterns** section. For each pattern referenced there (by ID), check whether that published pattern's own Related Patterns section already references the new pattern back.
   - If not, **add a back-reference** to the already-published pattern's Related Patterns section, under the appropriate relationship sub-heading (Works Well With / Alternative Approaches / Typical Sequence). Write a brief description from the perspective of the existing pattern. Create the sub-heading if it doesn't exist.
   - If the already-published pattern's Related Patterns section contains any operator status messages (e.g., "No published patterns in the index — skipping related pattern proposals."), **remove them**.
   - Report all cross-reference updates to the operator.
5. **Report success** with a summary of what was published
6. **Offer to commit** — create a commit with the new pattern file, updated index, and any cross-referenced pattern files. The operator decides.

## On Check Failure

- Report which checks failed with details
- If annotations remain: list them with line numbers and type
- If sections are missing: list which ones
- If URLs are broken: list them with line numbers and HTTP status
- **Do NOT move the file**
- Suggest next steps (e.g., "remove remaining annotations", "add the missing sections")

## After Commit

After the commit, remind the operator of the next steps by referencing the Git workflow:

> Next steps — see [docs/git-workflow.md](../docs/git-workflow.md):
> - **Step 4:** Push the branch and open a PR
> - **Step 6:** Return to master after the PR is merged
