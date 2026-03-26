# AI-Assisted Authorship Workflow

This document explains how the RSE-CEP project uses Claude Code for AI-assisted content extraction and authoring. It is intended for team members who will use this workflow to create content for the site.

## Overview

The authoring pipeline uses Claude Code (Anthropic's CLI tool for AI-assisted development) with **four slash commands** (`/extract`, `/draft`, `/publish`, and `/update`) that guide AI-assisted content extraction from source documents through a discover-draft-review-publish-maintain lifecycle.

The key principle is **extraction before elaboration**: the AI first mines content from real source material (interview transcripts, talk transcripts, notes, slides), then separately proposes content for any gaps — clearly marking what is extracted vs. generated using structured inline annotations.

All patterns are classified by type — **Implementation (I)**, **Architectural (A)**, **Design (D)**, or **Process (P)** — at the proto-pattern stage. The type determines emphasis across sections and is encoded in the pattern ID (e.g., `I-001`, `A-002`, `P-001`). See `docs/pattern_typology.md` for the full typology.

### Two Paths to a Pattern

- **Incremental (recommended):** Run `/extract` on multiple source documents to build up proto-patterns — lightweight evidence sketches in `_local/protopatterns/` (gitignored). When a proto-pattern has enough evidence, run `/draft` to create a full pattern draft.
- **Direct:** Run `/draft` directly on a single source document to create a full draft in one step. Best when a single source is rich enough for a complete pattern.

**Local-first model (v1):** Proto-patterns and annotated drafts are user-local (gitignored). The person who extracts is the person who drafts. Clean drafts are exported to `drafts/patterns/` for commit and PR review. Nothing with `ptr:` annotations or source-derived content is ever committed.

## Prerequisites

- **Claude Code** installed and authenticated. See [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) for setup.
- The project cloned locally with dependencies installed (`npm install`).
- Access to source documents on institutional Sharepoint.

## Step-by-Step Workflow

### 1. Prepare source material

Download the source document from Sharepoint into the `_sources/` directory at the project root. This directory is **gitignored** — contents are never committed.

```bash
# Example: copy a transcript into _sources/
cp ~/Downloads/interview-j-example-2026-02-15.docx _sources/
```

### 2. Start Claude Code

Launch Claude Code from the project root:

```bash
claude
```

Claude Code will read the `CLAUDE.md` file at the project root, which provides context about the project structure, schemas, and conventions.

### 3. Mine proto-patterns with `/extract` (incremental path)

Run the extraction command to discover candidate patterns in a source document:

```
/extract _sources/interview-j-example-2026-02-15.docx
Focus on NER and text processing patterns for historical newspapers.
```

The command operates in four stages:

#### Stage 1 — Source Analysis

Claude reads the source and identifies candidate patterns — recurring practices, solutions, named approaches. Each candidate is assigned a type (I/A/D/P) using the classification decision guide from `docs/pattern_typology.md`. Extracting multiple types from one source is expected.

#### Stage 2 — Index Matching

Claude compares candidates against existing proto-patterns in `_local/protopatterns/index.md` and presents a match table for your confirmation.

#### Stage 3 — Create or Update

For new candidates, Claude assigns a typed ID (`{I|A|D|P}-NNN`) and creates a proto-pattern file and index entry. This ID is permanent — it follows the pattern through draft and publication. For matches with existing entries, Claude adds new projects and evidence to the existing proto-pattern.

#### Stage 4 — Write and Report

Claude writes all files and reports a summary (created N, updated N, total in index).

#### Repeat with more sources

Run `/extract` on additional source documents. Each run may add evidence to existing proto-patterns or discover new ones. Over time, proto-patterns accumulate evidence from multiple sources.

### 4. Create a full draft with `/draft`

When a proto-pattern has sufficient evidence, or when working directly from a single source:

```
# From a proto-pattern (incremental path):
/draft _local/protopatterns/ner-newspapers.md

# From a source document (direct path):
/draft _sources/interview-j-example-2026-02-15.docx
Focus on NER and text processing patterns for historical newspapers.
```

The command operates in four stages:

#### Stage 1 — Source Classification and Type Confirmation

Claude characterises the input:
- **Interview transcript:** structured by questions, rich in contextual detail
- **Talk transcript:** narrative flow, may need more restructuring
- **Manual notes:** sparse, telegraphic — more elaboration needed
- **Slides:** fragmentary claims — significant elaboration needed
- **Proto-pattern:** accumulated evidence from multiple sources
- **Mixed:** combination of the above

Claude also confirms the pattern type (I/A/D/P). If drafting from a typed proto-pattern, the type is inherited. If drafting from a source document, Claude proposes a type and waits for confirmation.

The classification and type determine the extraction strategy and section emphasis.

#### Stage 2 — Template-Aware Extraction

Claude extracts content into the pattern template structure, populating:
- **Frontmatter fields** according to the Zod schema in `src/content.config.ts`
- **Body sections** according to the pattern template (Intent, Context, Issues, Solution, etc.)

For each section, Claude indicates whether the content was extracted from source or absent/thin.

#### Stage 3 — Guided Elaboration

For gaps identified in Stage 2, Claude proposes content that is clearly marked as model-generated. The operator can accept, reject, or rewrite each proposal.

**Related pattern proposals:** If published patterns exist in `drafts/pattern-index.md`, Claude matches the draft against the index using shared keywords, domains, type relationships, and semantic relevance. It presents a table of proposed related patterns with relationship types (Works Well With, Alternative Approaches, Typical Sequence) and rationale. The operator confirms or rejects each proposal before it is included in the Related Patterns section. If no published patterns exist, this step is skipped gracefully.

#### Stage 4 — Output and Validation

Claude writes the annotated draft to `_local/drafts/{slug}.md` (gitignored) with structured inline annotations and `ptr:` references to source files, then runs schema validation.

When drafting from a proto-pattern, Claude automatically removes the proto-pattern entry from the index and deletes the file after successful drafting.

#### Stage 5 — Export Gate

The annotated draft in `_local/drafts/` contains annotations referencing your local `_sources/`. Before committing:

1. **Verify annotations** — check `ptr:` ranges against source files
2. **Strip annotations** — remove all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers
3. **Copy to repo** — move the clean draft to `drafts/patterns/{slug}.md`
4. **Commit** on the feature branch

You can ask Claude to perform the export, or do it manually. Run `node scripts/check-draft.js drafts/patterns/{slug}.md` to confirm no annotations remain.

A review tool to automate annotation verification and stripping is planned but not yet implemented. The manual process is sufficient for v1.

### 5. Review the draft

The annotated draft in `_local/drafts/` contains **inline annotations** marking the provenance of every piece of content:

```markdown
[EXTRACTED | source: "Interview with J. Example" | ref: Q3 response | "exact quote from source"]

[ELABORATED | basis: "inferred from FAIR principles context"]
```

**Your job as reviewer:**
1. Read each annotation alongside the original source material
2. Verify extracted content is faithful to the source
3. Verify elaborated content is appropriate and accurate
4. **Delete each annotation** as you verify it
5. Edit content as needed — adjust for HASS context, correct errors, add detail

Note: It is *crucial* to disable Copilot or any other generative tools that make suggestions. They will frequently see that you have removed an annotation and suggest removing the others without proper review. This would defeat the purpose of the annotation system and risk publishing unverified content.

You can check your progress at any time:

```bash
node scripts/check-draft.js _local/drafts/{slug}.md
```

This reports how many annotations remain and where they are.

### 6. Publish with `/publish`

Once all annotations are removed and the content is verified:

```
/publish drafts/patterns/{slug}.md
```

The publish command runs checks including schema validation, annotation check, section completeness, URL verification, and quality review.

If all checks pass, the file is moved from `drafts/patterns/` to `src/content/patterns/`, a row is appended to the published pattern index (`drafts/pattern-index.md`) with an agent-written summary for future relationship matching, and you're offered to commit.

If any check fails, the command reports what needs fixing and does not move the file.

### 7. Commit and open a PR

```bash
git checkout -b feature/pattern-ner-newspapers
git add src/content/patterns/ner-newspapers.md
git commit -m "Add NER for historical newspapers pattern"
git push -u origin feature/pattern-ner-newspapers
```

Then open a pull request on GitHub targeting `master`. CI will automatically run schema validation and a trial site build.

### 8. Review and merge

Team members review the PR. Once CI passes and the content is approved, merge to `master`. The deployment workflow will automatically build and publish the site to GitHub Pages.

## Proto-Pattern Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│ Proto-Pattern Accumulation (LOCAL — gitignored)                      │
│                                                                     │
│  _sources/doc1.docx ──→ /extract ──→ _local/protopatterns/slug.md ◄─┐│
│  _sources/doc2.docx ──→ /extract ──→ (updates existing)             ││
│  _sources/doc3.docx ──→ /extract ─────────────────────────────────┘│
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                     /draft (from proto-pattern)
                               │
                               ▼
                  _local/drafts/slug.md ──→ verify & strip ──→ drafts/patterns/slug.md ──→ /publish ──→ src/content/patterns/
                  (annotated, local)         (export gate)       (clean, committed)                      (production)
```

## Direct Draft Lifecycle

| Step | Output | Notes |
|------|--------|-------|
| `_sources/doc.docx` | — | Source document |
| `/draft` | `_local/drafts/slug.md` | Annotated draft (gitignored) |
| Human review | (same file, edited) | Verify annotations against sources |
| Export gate | `drafts/patterns/slug.md` | Strip annotations, copy to repo |
| `/publish` | `src/content/patterns/slug.md` | Production |

- **Proto-patterns** are freeform evidence sketches — they accumulate material from multiple sources before a full draft is created
- **Proto-patterns and annotated drafts are local** — they live in `_local/` (gitignored), never committed
- **Clean drafts are committed** — annotations are stripped before export to `drafts/patterns/`
- **Annotations preserve provenance** — the annotated copy in `_local/drafts/` shows what was extracted vs. elaborated
- **Human verification is required** — the publish gate enforces that all annotations are removed

## Updating Published Patterns

Published patterns can be edited in-place using the `/update` command. This supports both operator-directed fixes and AI-assisted content additions, with an annotation system that scales to the level of AI contribution.

### When to use `/update`

- Fix typos, broken URLs, or outdated information
- Add new Known Uses or Implementation Examples discovered after publication
- Expand sections with additional context or guidance
- Update Related Patterns as new patterns are published
- Adjust keywords, HASS domains, or other metadata

### Running `/update`

```
# By file path:
/update src/content/patterns/co-located-metadata-and-data.md

# By pattern ID:
/update A-004
```

### Editing modes

The command distinguishes two kinds of changes:

- **Operator-directed edits** — when you tell Claude exactly what to change (fix this typo, update this URL, reword this to say X), no annotations are added. You are the author.
- **Model-generated content** — when Claude generates new narrative (a new Known Use, expanded guidance, etc.), it annotates with `[ELABORATED | basis: "..."]`. You must review and remove these annotations before finishing, the same as the `/draft` review workflow.

### Exit gate

When you signal you're done, the command runs:
1. Schema validation
2. Section completeness check
3. Annotation check — blocks if any `[ELABORATED | ...]` markers remain
4. URL verification on new or changed URLs only

### Maintenance tasks

After the exit gate passes, the command automatically:
- **Syncs the pattern index** (`drafts/pattern-index.md`) if title, keywords, domains, or the pattern's essence changed
- **Updates cross-references** in other published patterns if Related Patterns was modified (adds or removes back-references)
- **Offers to commit** all changed files on a feature branch

## What Claude Code Sees

When Claude Code starts in this project, it reads:

1. **`CLAUDE.md`** — project context, architecture, conventions, and constraints
2. **`.claude/commands/extract.md`** — the proto-pattern mining command
3. **`.claude/commands/draft.md`** — the full pattern drafting command
4. **`.claude/commands/publish.md`** — the publish command definition
5. **`.claude/commands/update.md`** — the published pattern editing command
6. **`tools/prompt-templates/*.md`** — per-content-type templates specifying expected fields and sections
7. **`src/content.config.ts`** — the Zod schemas (the authoritative field definitions)

The commands use `scripts/validate.js` and `scripts/check-draft.js` to verify output quality.

## Troubleshooting

| Problem | Solution |
|---|---|
| Validation fails on a field you think is correct | Check `src/content.config.ts` — the Zod schema is the source of truth. The field might need a different type or format. |
| Claude generates too much elaborated content | Be more specific in your `/draft` prompt. Tell it to "extract only, do not elaborate" if you prefer minimal output. |
| Source document is too large for context | Break it into sections and extract from each section separately. |
| `/extract` matches the wrong proto-pattern | The matching step always asks for confirmation. Reject the match and it will create a new proto-pattern instead. |
| Proto-pattern has too little evidence for `/draft` | Run `/extract` on more source documents to accumulate additional evidence before drafting. |
| `/publish` fails on annotations | Run `node scripts/check-draft.js drafts/patterns/{slug}.md` to see remaining annotations. Review and delete them. |
| `/publish` fails on missing sections | Add the missing H2 sections to the draft before re-running. |
| `/update` exit gate blocks on annotations | Run `node scripts/check-draft.js src/content/patterns/{slug}.md` to see remaining annotations. Review each one and delete the annotation marker once verified. |
| `/update` pattern ID not found | Check `drafts/pattern-index.md` — the pattern must have an entry in the index. If not, use the file path instead. |

## Security and Sensitivity

- **Never commit source documents.** The `_sources/` directory is gitignored. Source documents contain research participant data with consent obligations.
- **The `source_ref` field** should be a human-readable description (e.g., "Interview with J. Example, 2026-02-15"), not a file path or Sharepoint URL.
- **Review AI output carefully** before committing. The AI may inadvertently include identifying details from transcripts in the extracted content. Redact as needed.
