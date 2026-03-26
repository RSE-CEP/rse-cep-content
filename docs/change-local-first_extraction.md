# Change Spec: Local-First Extraction and Drafting Workflow

**Author:** Mat Bettinson  
**Date:** 2026-03-26  
**Status:** Draft for review  
**Target phase:** 14 (replaces current 14, defers 15)  
**Related:** `docs/spec.md`, `docs/implementation_plan.md`, `docs/change-spec-source-pointer-review-tool.md`

---

## Problem

The current workflow model assumes proto-patterns are committed to the repository and can accumulate evidence from multiple users. This creates an unresolvable data access problem:

1. **Source locality.** The `/draft` command writes `ptr:` annotations referencing files in `_sources/`. But `_sources/` is gitignored. If Alice extracts a proto-pattern and commits it, and Bob later drafts from it, Bob's `/draft` run fails — he doesn't have Alice's source files.

2. **Protopattern leakage.** Despite instructions to avoid it, proto-patterns are capturing paraphrased quotes and other source-derived content. This content cannot be safely committed.

3. **Multi-user complexity.** The "accumulate evidence from multiple sources across multiple users" model requires solving distributed data access (SharePoint sync, encrypted file sharing, etc.) — effort that exceeds project scope and resources.

The root cause: proto-patterns were designed as collaborative artefacts, but the source sensitivity and pointer-based annotation system requires that the person drafting has local access to all referenced sources. These goals conflict.

---

## Solution Overview

Simplify the workflow to **single-user, local-first**:

1. **Proto-patterns become user-local.** They live in `_local/protopatterns/` (gitignored), not `drafts/protopatterns/` (committed). The index is also local.

2. **Annotated drafts are also local.** `/draft` outputs to `_local/drafts/` (gitignored). The draft contains `ptr:` annotations referencing the user's local `_sources/`.

3. **Clean drafts are committed.** After the operator verifies annotations and strips them (manually for now, via review tool later), the clean draft is copied/moved to `drafts/patterns/` and committed.

4. **Collaboration happens at the PR stage.** The team reviews clean drafts via pull requests — the substance and quality of the pattern, not the AI provenance annotations.

This means:
- The person who extracts is the person who drafts (for v1)
- Source files never need to be shared between users
- Nothing with `ptr:` annotations or source-derived content is ever committed
- Multi-user collaboration is explicitly deferred, not silently broken

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOCAL (gitignored)                       │
├─────────────────────────────────────────────────────────────────┤
│  _sources/              Your source documents                   │
│  _local/protopatterns/  Your proto-patterns + index             │
│  _local/drafts/         Your annotated drafts (ptr: refs)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ operator verifies & strips annotations
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMMITTED (repo)                           │
├─────────────────────────────────────────────────────────────────┤
│  drafts/patterns/       Clean drafts ready for PR review        │
│  src/content/patterns/  Published patterns                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1 — Local Directory Structure

### New directories

Create `_local/` with two subdirectories:

```
_local/
├── protopatterns/
│   ├── index.md          # user's proto-pattern index
│   └── *.md              # proto-pattern files
└── drafts/
    └── *.md              # annotated draft files
```

### Gitignore update

Add to `.gitignore`:

```
_local/
```

### Remove committed proto-pattern structure

- Delete `drafts/protopatterns/` directory (including `index.md` and any existing proto-patterns)
- These are replaced by the local equivalents

---

## Part 2 — Command Changes

### `/extract` command (`.claude/commands/extract.md`)

Update output paths:

| Current | New |
|---------|-----|
| `drafts/protopatterns/` | `_local/protopatterns/` |
| `drafts/protopatterns/index.md` | `_local/protopatterns/index.md` |

No other logic changes. The command still:
- Mines sources for candidates
- Matches against the index
- Creates or updates proto-pattern files
- Maintains the index

Add a note in the command preamble:

> **Local-only output.** Proto-patterns are stored in `_local/protopatterns/` (gitignored). They are your working notes, not shared artefacts. The person who extracts should be the person who drafts.

### `/draft` command (`.claude/commands/draft.md`)

Update output paths:

| Current | New |
|---------|-----|
| `drafts/patterns/{slug}.md` | `_local/drafts/{slug}.md` |

Update proto-pattern input path:

| Current | New |
|---------|-----|
| `drafts/protopatterns/` | `_local/protopatterns/` |

Update proto-pattern cleanup (Stage 3, after successful draft):

| Current | New |
|---------|-----|
| Remove from `drafts/protopatterns/index.md` | Remove from `_local/protopatterns/index.md` |
| Delete `drafts/protopatterns/{file}.md` | Delete `_local/protopatterns/{file}.md` |

Add new **Stage 5 — Export Gate** after Stage 4:

> ### Stage 5 — Export Gate
>
> The draft in `_local/drafts/` contains annotations that reference your local `_sources/`. Before committing:
>
> 1. **Verify annotations.** Open the draft and each referenced source file. Confirm the `ptr:` ranges are accurate and the `basis:` descriptions are faithful.
>
> 2. **Strip annotations.** Remove all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers from the file, leaving the content in place. (A review tool to assist with this is planned but not yet implemented.)
>
> 3. **Copy to repo.** Move or copy the clean draft to `drafts/patterns/{slug}.md`.
>
> 4. **Commit.** The clean draft is now safe to commit and push for PR review.
>
> Report to the operator:
> ```
> ## Export Checklist
>
> Your annotated draft is at: _local/drafts/{slug}.md
>
> Before committing:
> [ ] Verify ptr: annotations against source files
> [ ] Strip all [EXTRACTED | ...] and [ELABORATED | ...] markers
> [ ] Copy clean file to drafts/patterns/{slug}.md
> [ ] Commit on feature branch
>
> Run `node scripts/check-draft.js drafts/patterns/{slug}.md` to confirm no annotations remain.
> ```

Update the Pre-flight Branch Gate to note that commits happen to `drafts/patterns/`, not `_local/drafts/`.

### `/publish` command (`.claude/commands/publish.md`)

No path changes — `/publish` already operates on `drafts/patterns/` (the committed location).

Add a guard at the start:

> **Pre-flight: Annotation check**
>
> Before proceeding, run `node scripts/check-draft.js` on the target file. If annotations are detected, halt and instruct the operator to complete the export gate (strip annotations) before publishing.

This catches any case where an annotated draft was accidentally copied to `drafts/patterns/` without stripping.

---

## Part 3 — Documentation Updates

### `docs/spec.md`

**§3 (Repository Structure):**
- Remove `drafts/protopatterns/` from the tree
- Add `_local/` to the tree (with note: "gitignored, user-local working files")
- Update descriptions

**§7 (Commands):**
- `/extract`: Update output path reference
- `/draft`: Update output path reference, add Export Gate description

**§10 (Workflow):**
- Update the end-to-end workflow to reflect local-first extraction/drafting
- Add explicit note: "v1 assumes single-user workflow — the person who extracts is the person who drafts"

### `docs/ai-authorship-workflow.md`

- Update all path references from `drafts/protopatterns/` to `_local/protopatterns/`
- Update draft output path references
- Add "Export Gate" section explaining the manual annotation stripping step
- Add note about future review tool (Phase 15, deferred)

### `CLAUDE.md`

- Update Architecture section to reflect local-first structure
- Update command descriptions with new paths

---

## Part 4 — Implementation Plan Updates

### Revise Phase 14

Replace current Phase 14 content with this scope:

**Phase 14 — Local-First Workflow & Source Pointer Annotations**

Combines the annotation format migration (from previous Phase 14) with the local-first workflow restructure.

- [ ] 14a — Create `_local/` directory structure:
  - Create `_local/protopatterns/` with empty `index.md`
  - Create `_local/drafts/`
  - Add `_local/` to `.gitignore`
  - Delete `drafts/protopatterns/` (move any existing content to `_local/` first if needed)

- [ ] 14b — Update `/extract` command:
  - Change output paths to `_local/protopatterns/`
  - Add local-only note to preamble
  - Ensure no source content leaks into proto-patterns (reinforce existing instruction)

- [ ] 14c — Update `/draft` command:
  - Change output path to `_local/drafts/`
  - Change proto-pattern input path to `_local/protopatterns/`
  - Update proto-pattern cleanup paths
  - Implement pointer-based EXTRACTED annotation syntax (from previous Phase 14 spec)
  - Add Stage 5 Export Gate with checklist

- [ ] 14d — Update `/publish` command:
  - Add annotation check guard at start

- [ ] 14e — Update `scripts/check-draft.js`:
  - Ensure it works on both `_local/drafts/` and `drafts/patterns/` paths
  - Update regex for new EXTRACTED annotation format (from previous Phase 14 spec)

- [ ] 14f — Update documentation:
  - `docs/spec.md` — repo structure, command descriptions, workflow
  - `docs/ai-authorship-workflow.md` — paths, export gate section
  - `CLAUDE.md` — architecture, command descriptions
  - `docs/implementation_plan.md` — this phase

- [ ] 14g — Manual testing:
  - Run `/extract` — verify output goes to `_local/protopatterns/`
  - Run `/draft` from proto-pattern — verify output goes to `_local/drafts/` with pointer-based annotations
  - Manually strip annotations, copy to `drafts/patterns/`, run `check-draft.js` — verify passes
  - Run `/publish` on file with annotations remaining — verify it blocks

### Comment out Phase 15

Phase 15 (Draft Review Tool) is deferred. The manual export gate workflow is sufficient for v1. Add a note:

> **Phase 15 — Draft Review Tool (DEFERRED)**
>
> A browser-based tool for stepping through annotations and verifying against source files. Deferred pending validation of the local-first workflow. The manual export gate (Stage 5 in `/draft`) provides equivalent functionality without tooling.

---

## What This Does NOT Change

- Annotation syntax for ELABORATED (unchanged)
- `/publish` core logic (unchanged, just adds pre-flight guard)
- `/update` command (operates on published patterns, unaffected)
- `scripts/validate.js` (unchanged)
- The published pattern index (`drafts/pattern-index.md`) (unchanged)
- PR/CI workflow (unchanged)
- The principle that drafts go through human review before publication

---

## Migration

Minimal. The repo currently has:
- Empty or near-empty `drafts/protopatterns/` — delete or move to `_local/`
- No annotated drafts in `drafts/patterns/` — nothing to migrate

If any proto-patterns exist in `drafts/protopatterns/`, move them to `_local/protopatterns/` before deleting the committed directory.

---

## Future Considerations (Out of Scope)

- **Multi-user source sharing.** If the project later requires multiple users to collaborate on proto-patterns, options include: encrypted source bundles, SharePoint sync tooling, or a "source summary" format that captures enough context without the raw files. This is explicitly not v1 scope.

- **Review tool.** Phase 15 can be revived when the manual workflow proves cumbersome. The tool would operate on `_local/drafts/` and assist with annotation verification and stripping.
