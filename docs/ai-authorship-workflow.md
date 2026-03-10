# AI-Assisted Authorship Workflow

This document explains how the RSE-CEP project uses Claude Code for AI-assisted content extraction and authoring. It is intended for team members who will use this workflow to create content for the site.

## Overview

The authoring pipeline uses Claude Code (Anthropic's CLI tool for AI-assisted development) with a custom **skill** — a structured prompt definition that tells Claude how to extract content from source documents and produce valid markdown files for the Astro content collections.

The key principle is **extraction before elaboration**: the AI first mines content from real source material (interview transcripts, talk transcripts, notes, slides), then separately proposes content for any gaps — clearly marking what is extracted vs. generated.

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

### 3. Run the extraction skill

Invoke the Claude skill with context about what you want to extract:

```
Use the extraction skill in tools/claude-skill.md to extract patterns
from _sources/interview-j-example-2026-02-15.docx.
Focus on NER and text processing patterns for historical newspapers.
```

The skill operates in four stages:

#### Stage 1 — Source Classification

Claude characterises the input document:
- **Interview transcript:** structured by questions, rich in contextual detail
- **Talk transcript:** narrative flow, may need more restructuring
- **Manual notes:** sparse, telegraphic — more elaboration needed
- **Slides:** fragmentary claims — significant elaboration needed
- **Mixed:** combination of the above

The classification determines the extraction strategy.

#### Stage 2 — Template-Aware Extraction

Claude extracts content into the target format (pattern, roadmap item, or principle), populating:
- **Frontmatter fields** according to the Zod schema in `src/content/config.ts`
- **Body sections** according to the content type conventions (e.g., Context, Problem, Solution, HASS Considerations, Examples for patterns)

For each field and section, Claude indicates whether the content was:
- **Extracted from source** — with citation of where in the source it came from
- **Absent/thin in source** — flagged as a gap, not silently filled

#### Stage 3 — Guided Elaboration

For gaps identified in Stage 2, Claude proposes content that is clearly marked as model-generated. The operator can:
- **Accept** the elaboration as-is
- **Reject** it (leave the section thin or empty)
- **Rewrite** it with domain-specific knowledge

This is where generic technical detail gets added. The operator's job is to edit for HASS context — the AI provides a starting point, not the final word.

#### Stage 4 — Output and Validation

Claude:
1. Writes the markdown file to `src/content/{type}/{slug}.md`
2. Runs `scripts/validate.js` against the written file
3. If validation fails, reads the errors and fixes them automatically
4. Reports final status

### 4. Review the output

After the skill completes, review what was generated:

```bash
git diff                    # See all changes
git diff src/content/       # See just content changes
```

Edit the generated file directly. Common edits:
- Adjusting HASS-specific context that the AI got wrong or oversimplified
- Removing or rewriting elaborated content that doesn't fit
- Correcting the `confidence` score based on how much was truly extracted vs. generated
- Updating `source_ref` to be appropriately descriptive

### 5. Validate locally

Run validation to confirm the file passes schema checks:

```bash
npm run validate
# or validate a specific file:
npm run validate -- src/content/patterns/ner-newspapers.md
```

### 6. Commit and open a PR

```bash
git checkout -b feature/pattern-ner-newspapers
git add src/content/patterns/ner-newspapers.md
git commit -m "Add NER for historical newspapers pattern"
git push -u origin feature/pattern-ner-newspapers
```

Then open a pull request on GitHub targeting `main`. CI will automatically run schema validation and a trial site build.

### 7. Review and merge

Team members review the PR. Once CI passes and the content is approved, merge to `main`. The deployment workflow will automatically build and publish the site to GitHub Pages.

## What Claude Code Sees

When Claude Code starts in this project, it reads:

1. **`CLAUDE.md`** — project context, architecture, conventions, and constraints
2. **`tools/claude-skill.md`** — the skill definition with the four-stage extraction flow
3. **`tools/prompt-templates/*.md`** — per-content-type templates specifying expected fields and sections
4. **`src/content/config.ts`** — the Zod schemas (the authoritative field definitions)

The skill definition tells Claude to use `scripts/validate.js` as a check on its own output. This creates a feedback loop: generate → validate → fix → re-validate.

## Troubleshooting

| Problem | Solution |
|---|---|
| Validation fails on a field you think is correct | Check `src/content/config.ts` — the Zod schema is the source of truth. The field might need a different type or format. |
| Claude generates too much elaborated content | Be more specific in your extraction prompt. Tell it to "extract only, do not elaborate" if you prefer minimal output. |
| Source document is too large for context | Break it into sections and extract from each section separately. |
| Claude doesn't know about the skill | Make sure you're running Claude Code from the project root so it reads `CLAUDE.md`. Reference the skill file explicitly in your prompt. |

## Security and Sensitivity

- **Never commit source documents.** The `_sources/` directory is gitignored. Source documents contain research participant data with consent obligations.
- **The `source_ref` field** should be a human-readable description (e.g., "Interview with J. Example, 2026-02-15"), not a file path or Sharepoint URL.
- **Review AI output carefully** before committing. The AI may inadvertently include identifying details from transcripts in the extracted content. Redact as needed.
