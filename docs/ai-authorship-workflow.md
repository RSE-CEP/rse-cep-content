# AI-Assisted Authorship Workflow

This document explains how the RSE-CEP project uses Claude Code for AI-assisted content extraction and authoring. It is intended for team members who will use this workflow to create content for the site.

## Overview

The authoring pipeline uses Claude Code (Anthropic's CLI tool for AI-assisted development) with **three slash commands** (`/extract`, `/draft`, and `/publish`) that guide AI-assisted content extraction from source documents through a discover-draft-review-publish lifecycle.

The key principle is **extraction before elaboration**: the AI first mines content from real source material (interview transcripts, talk transcripts, notes, slides), then separately proposes content for any gaps — clearly marking what is extracted vs. generated using structured inline annotations.

### Two Paths to a Pattern

- **Incremental (recommended):** Run `/extract` on multiple source documents to build up proto-patterns — lightweight evidence sketches in `drafts/protopatterns/`. When a proto-pattern has enough evidence, run `/draft` to create a full pattern draft.
- **Direct:** Run `/draft` directly on a single source document to create a full draft in one step. Best when a single source is rich enough for a complete pattern.

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

Claude reads the source and identifies candidate patterns — recurring practices, solutions, named approaches.

#### Stage 2 — Index Matching

Claude compares candidates against existing proto-patterns in `drafts/protopatterns/index.md` and presents a match table for your confirmation.

#### Stage 3 — Create or Update

For new candidates, Claude creates a proto-pattern file and index entry. For matches with existing entries, Claude adds new projects and evidence to the existing proto-pattern.

#### Stage 4 — Write and Report

Claude writes all files and reports a summary (created N, updated N, total in index).

#### Repeat with more sources

Run `/extract` on additional source documents. Each run may add evidence to existing proto-patterns or discover new ones. Over time, proto-patterns accumulate evidence from multiple sources.

### 4. Create a full draft with `/draft`

When a proto-pattern has sufficient evidence, or when working directly from a single source:

```
# From a proto-pattern (incremental path):
/draft drafts/protopatterns/ner-newspapers.md

# From a source document (direct path):
/draft _sources/interview-j-example-2026-02-15.docx
Focus on NER and text processing patterns for historical newspapers.
```

The command operates in four stages:

#### Stage 1 — Source Classification

Claude characterises the input:
- **Interview transcript:** structured by questions, rich in contextual detail
- **Talk transcript:** narrative flow, may need more restructuring
- **Manual notes:** sparse, telegraphic — more elaboration needed
- **Slides:** fragmentary claims — significant elaboration needed
- **Proto-pattern:** accumulated evidence from multiple sources
- **Mixed:** combination of the above

The classification determines the extraction strategy.

#### Stage 2 — Template-Aware Extraction

Claude extracts content into the pattern template structure, populating:
- **Frontmatter fields** according to the Zod schema in `src/content.config.ts`
- **Body sections** according to the pattern template (Intent, Context, Issues, Solution, etc.)

For each section, Claude indicates whether the content was extracted from source or absent/thin.

#### Stage 3 — Guided Elaboration

For gaps identified in Stage 2, Claude proposes content that is clearly marked as model-generated. The operator can accept, reject, or rewrite each proposal.

#### Stage 4 — Output and Validation

Claude writes the draft file to `drafts/patterns/{slug}.md` with structured inline annotations, then runs schema validation.

When drafting from a proto-pattern, Claude offers to remove the proto-pattern entry from the index and delete the file after successful drafting.

### 5. Review the draft

The draft file in `drafts/patterns/` contains **inline annotations** marking the provenance of every piece of content:

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
node scripts/check-draft.js drafts/patterns/{slug}.md
```

This reports how many annotations remain and where they are.

### 6. Publish with `/publish`

Once all annotations are removed and the content is verified:

```
/publish drafts/patterns/{slug}.md
```

The publish command runs three checks:
1. **Schema validation** — frontmatter conforms to the Zod schema
2. **Annotation check** — no `[EXTRACTED |` or `[ELABORATED |` markers remain
3. **Section completeness** — all 9 essential sections are present

If all checks pass, the file is moved from `drafts/patterns/` to `src/content/patterns/` and you're offered to commit.

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
│ Proto-Pattern Accumulation                                          │
│                                                                     │
│  _sources/doc1.docx ──→ /extract ──→ protopatterns/slug.md  ◄──┐    │
│  _sources/doc2.docx ──→ /extract ──→ (updates existing)        │    │
│  _sources/doc3.docx ──→ /extract ──────────────────────────────┘    │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                     /draft (from proto-pattern)
                               │
                               ▼
                  drafts/patterns/slug.md ──→ review ──→ /publish ──→ src/content/patterns/slug.md
                  (with annotations)          (verify)                 (production)
```

## Direct Draft Lifecycle

| Step | Output | Notes |
|------|--------|-------|
| `_sources/doc.docx` | — | Source document |
| `/draft` | `drafts/patterns/slug.md` | With inline annotations |
| Human review | (same file, edited) | Verify and delete annotations |
| `/publish` | `src/content/patterns/slug.md` | Production |

- **Proto-patterns** are freeform evidence sketches — they accumulate material from multiple sources before a full draft is created
- **Drafts are committed to git** — they are tracked work-in-progress, not ephemeral
- **Annotations preserve provenance** — git history of the draft shows what was extracted vs. elaborated
- **Human verification is required** — the publish gate enforces that all annotations are removed

## What Claude Code Sees

When Claude Code starts in this project, it reads:

1. **`CLAUDE.md`** — project context, architecture, conventions, and constraints
2. **`.claude/commands/extract.md`** — the proto-pattern mining command
3. **`.claude/commands/draft.md`** — the full pattern drafting command
4. **`.claude/commands/publish.md`** — the publish command definition
5. **`tools/prompt-templates/*.md`** — per-content-type templates specifying expected fields and sections
6. **`src/content.config.ts`** — the Zod schemas (the authoritative field definitions)

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

## Security and Sensitivity

- **Never commit source documents.** The `_sources/` directory is gitignored. Source documents contain research participant data with consent obligations.
- **The `source_ref` field** should be a human-readable description (e.g., "Interview with J. Example, 2026-02-15"), not a file path or Sharepoint URL.
- **Review AI output carefully** before committing. The AI may inadvertently include identifying details from transcripts in the extracted content. Redact as needed.
