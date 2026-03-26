# Change Spec: Source Pointer Annotations & Draft Review Tool

**Author:** Mat Bettinson  
**Date:** 2026-03-26  
**Status:** Approved for implementation  
**Target phases:** 14 (annotation format migration) + 15 (review tool)  
**Related:** `docs/spec.md`, `docs/implementation_plan.md`

---

## Problem

The current annotation system embeds quoted text from source documents directly in draft pattern files:

```
[EXTRACTED | source: "interview transcript" | ref: "Q3, para 2" | "participant describes their workflow as..."]
```

Draft files in `drafts/patterns/` are committed to the repository. This creates two problems:

1. **Security / privacy risk.** Source documents may contain research participant data (interview transcripts) subject to consent obligations. Quoted content in annotations can leak sensitive material into the public repo if a draft is committed carelessly. Filenames also carry risk — `boris_cherney_interview.md` is identifying even if its contents are not.

2. **Review friction.** The operator must manually open the source document and locate the relevant passage alongside the draft in VS Code. There is no tooling support for this verification step despite it being a core quality gate.

---

## Solution Overview

Two coordinated changes:

1. **Pointer-only annotations** — EXTRACTED annotations drop the embedded quote and instead carry a file + line-range pointer to the source text rendition. The sensitive content stays in `_sources/` (gitignored), never in the draft.

2. **Draft review tool** — A local Node.js web interface (`npm run review`) that presents a wizard over the draft's annotations, resolves pointers to display source context on demand, and writes annotation removals back to the markdown file in place.

These ship together (Phase 14 + 15). The repo has only two published patterns and an empty drafts directory — there is no migration burden.

---

## Part 1 — Pointer-Only Annotation Format

### New EXTRACTED annotation syntax

```
[EXTRACTED | source: "identifier" | ptr: "_sources/filename.txt:startline:endline" | basis: "short description of extracted content"]
```

Fields:

| Field | Description |
|-------|-------------|
| `source` | Human-readable source identifier (safe to commit — no participant names, no file paths with identifying detail) |
| `ptr` | Pointer to text rendition: repo-relative path to `.txt` file, colon-separated start and end line numbers (1-indexed, inclusive) |
| `basis` | Short description of what was extracted — the operator's readable summary, not a quote from the source. Safe to commit. |

ELABORATED annotations are unchanged — they contain no source material:

```
[ELABORATED | basis: "reason for elaboration"]
```

### Text renditions

Source documents that are not already plain text (`.docx`, `.pdf`, etc.) must be rendered to a `.txt` file before the pointer can be written. Convention:

- Rendition lives in `_sources/` alongside the original (both gitignored)
- Same filename stem, `.txt` extension: `some-talk.pdf` → `some-talk.txt`
- CC generates the rendition using available tools (pymupdf for PDF, python-docx or similar for docx) as part of the `/draft` or `/extract` run, before writing annotations
- If a `.txt` rendition already exists, it is used as-is

CC writes the pointer while reading the source — it is not reconstructing line numbers after the fact. The range should be generous (erring toward more context rather than less). The review tool displays several lines of buffer either side of the stated range.

### Source file naming — process rule

**Participant interview transcripts must use anonymised filenames** before being placed in `_sources/`. Use date-based or sequential naming: `interview-2026-03-15-a.txt`, `interview-2026-03-15-b.txt`. No participant names, roles, or institutions in filenames. This rule must be documented in `docs/spec.md` (§8 Source Document Management) and enforced as a convention — it cannot be automated.

### Changes required

#### `/draft` command (`.claude/commands/draft.md`)
- **Stage 4 (Output and Validation):** Update annotation syntax description. Pointers replace embedded quotes for EXTRACTED annotations. CC must:
  1. Ensure a `.txt` rendition of the source exists in `_sources/` (generate if needed)
  2. Record the line range of each extracted passage at the time of reading
  3. Write pointer in the new format — **no quoted text in the annotation**
- Add explicit instruction: *Do not embed quoted or paraphrased source text in EXTRACTED annotations. The `basis` field is a short description only (e.g. "participant describes multi-step validation workflow"). The source content is accessible via the pointer.*

#### `scripts/check-draft.js`
- Update annotation detection regex to match new EXTRACTED format (pointer-based)
- Optionally: add a lint check that flags any EXTRACTED annotation that appears to contain a quote (heuristic: `basis` field longer than ~100 chars, or contains quotation marks)

#### `tools/prompt-templates/pattern.md`
- Update Extraction Provenance Conventions section to document the new pointer syntax

#### `docs/spec.md`
- §4 (Output File Format): update annotation syntax examples
- §7 (Commands — `/draft`): update Stage 4 description
- §8 (Source Document Management): add anonymised filename rule, add text rendition convention

#### `CLAUDE.md`
- Update annotation syntax in Key Constraints and AI Authorship Commands sections

---

## Part 2 — Draft Review Tool

### Concept

A local Node.js server (`scripts/review-server.js`) serving a browser UI. Invoked via `npm run review`. The operator opens `localhost:4323` (avoiding clash with Astro dev on 4321), selects a draft from `drafts/patterns/`, and steps through its annotations one by one.

### UI design

Single-page wizard layout:

- **Header:** draft filename, progress indicator (e.g. "3 of 11 annotations")
- **Main panel:** the full section of the draft containing the current annotation, rendered as readable text. The annotation marker is highlighted inline.
- **Source panel (EXTRACTED only):** collapsible/popover panel showing the resolved source text — the lines indicated by the pointer, plus a small buffer either side. Labelled with the source identifier and line range. Not shown for ELABORATED annotations.
- **Action bar:**
  - *Accept & clear* — removes the annotation marker from the markdown, leaving the content in place. Writes to file immediately.
  - *Edit content* — opens a small inline text editor pre-populated with the annotated content. Operator edits, then accepts. Writes edited content + removes annotation to file.
  - *Skip* — moves to next annotation without changes (can return later)
- **Navigation:** previous / next annotation, jump to annotation N

Annotation state is encoded in the file itself — cleared annotation = reviewed. If the operator returns to a draft mid-review, the tool resumes from the first remaining annotation.

### Pointer resolution

The tool reads the `ptr` field, resolves the path relative to the repo root, reads the `.txt` file, slices the indicated line range, and adds a configurable buffer (default: 3 lines either side). If the pointer cannot be resolved (file missing, line out of range), the source panel displays a clear error rather than silently failing.

### Implementation notes

- Plain Node.js HTTP server — no framework needed for this scope
- Single HTML page served from the script — JS in the page handles annotation stepping and inline editing
- File writes are synchronous and immediate on each accept action (no undo — operator is in a review context, not an editor)
- Port: 4323 (document in README / package.json script description)
- The tool is read-only on source files — it never touches `_sources/`

### New script / package.json entry

```json
"review": "node scripts/review-server.js"
```

### Changes required

- Create `scripts/review-server.js`
- Add `review` script to `package.json`
- Document usage in `docs/ai-authorship-workflow.md` (draft review section)
- Document usage in `docs/pattern-pipeline.md` (Development section)

---

## What this does NOT change

- ELABORATED annotation syntax — unchanged
- `/extract`, `/publish`, `/update` command logic — unchanged (they do not produce EXTRACTED annotations with quotes; `/update` uses ELABORATED only)
- `scripts/validate.js` — no changes needed
- The publish gate (`check-draft.js` detects remaining annotations) — logic unchanged, regex update only
- The draft directory structure or git workflow

---

## Implementation sequence for CC

1. Update annotation syntax in `/draft` command and `tools/prompt-templates/pattern.md`
2. Update `check-draft.js` regex
3. Update `docs/spec.md`, `CLAUDE.md` to reflect new annotation format
4. Build `scripts/review-server.js` and add `npm run review`
5. Update `docs/ai-authorship-workflow.md` and `docs/pattern-pipeline.md` with review tool usage
6. Add Phase 14 and Phase 15 entries to `docs/implementation_plan.md`

Steps 1–3 are Phase 14. Steps 4–6 are Phase 15.
