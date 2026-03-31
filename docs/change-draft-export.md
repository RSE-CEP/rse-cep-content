# Change Proposal: Decouple Branch/Commit from Draft, Move to Export Step

**Status:** Implemented (2026-03-30)
**Date:** 2026-03-27
**Affects:** `/draft` command, `/publish` command, Phase 16 (review tool)

## Problem

The `/draft` command currently includes a branch gate (Pre-flight) and an export gate (Stage 5) that creates a feature branch and commits a clean draft to `drafts/patterns/`. This made sense when drafts were committed artefacts, but Phase 15 (local-first workflow) changed the picture:

- Annotated drafts live in `_local/drafts/` (gitignored)
- Clean exports go to `drafts/patterns/` only after annotation stripping
- The annotation review step is inherently human-paced (manual in VS Code today, Phase 16 review tool in future)

The branch gate in `/draft` now serves no purpose during the drafting session itself — everything produced is local. The branch is created for an export step that may happen days later, in a different session.

## Proposed Change

### 1. Remove branch gate from `/draft`

Strip the entire "Pre-flight: Branch Gate" section from `.claude/commands/draft.md`. The `/draft` command becomes purely local:

- Reads sources from `_sources/` or `_local/protopatterns/`
- Writes annotated draft to `_local/drafts/{slug}.md`
- Runs validation
- Reports status and stops

No git operations. No branch creation. No export gate.

### 2. Replace Stage 5 (Export Gate) with an operator checklist

The current Stage 5 presents an export checklist and optionally performs the export. Replace this with a simpler handoff:

```
## Draft Complete

- **File:** _local/drafts/{slug}.md
- **Annotations:** N [EXTRACTED], N [ELABORATED] markers
- **Validation:** PASS

Next steps:
1. Review annotations (manually in VS Code, or `npm run review` when available)
2. When ready to commit, run `/export` (or strip annotations and commit manually)
```

### 3. Introduce `/export` command (new)

A lightweight command that handles the transition from local draft to committed artefact:

1. **Branch gate.** If on `master`, create `feature/pattern-{slug}` (with the existing safety checks for unpushed commits, behind-origin state). If already on a feature branch, proceed.
2. **Annotation check.** Run `check-draft.js` against `_local/drafts/{slug}.md`. If annotations remain, halt and direct the operator to complete the review.
3. **Strip and copy.** Remove any residual annotation markers, write clean file to `drafts/patterns/{slug}.md`.
4. **Verify.** Run `check-draft.js` against the exported file to confirm clean.
5. **Commit.** Offer to commit on the feature branch.

This is essentially the current Stage 5 of `/draft` extracted into its own command, with the branch gate relocated here.

### 4. Update `/publish` branch gate

`/publish` already has its own branch gate. No change needed — it expects to be on a feature branch and will find one created by `/export`. The flow becomes:

```
/draft  -->  _local/drafts/{slug}.md  (local, no git)
            |
            v
   review annotations (VS Code or Phase 16 tool)
            |
            v
/export -->  drafts/patterns/{slug}.md  (creates branch, commits)
            |
            v
/publish --> src/content/patterns/{slug}.md  (validates, moves, indexes)
```

## Impact on Phase 16 (Review Tool)

Phase 16's export integration (16c) currently says: "After all annotations cleared, offer to copy clean file to `drafts/patterns/{slug}.md`". This aligns naturally with `/export`:

- The review tool clears annotations in `_local/drafts/`
- When done, it can either invoke `/export` or prompt the operator to run it
- The review tool does not need to handle branching or committing itself

## Files to Modify

| File | Change |
|------|--------|
| `.claude/commands/draft.md` | Remove Pre-flight Branch Gate. Remove Stage 5 Export Gate. Replace with handoff message. Renumber stages (4 stages, not 5). |
| `.claude/commands/export.md` | **New file.** Branch gate + annotation check + strip + copy + verify + commit. |
| `.claude/commands/publish.md` | Update annotation check pre-flight to note that `/export` should have been run first. No structural changes. |
| `CLAUDE.md` | Add `/export` to command list and workflow description. |
| `docs/ai-authorship-workflow.md` | Update workflow to show the `/draft` -> review -> `/export` -> `/publish` sequence. |
| `docs/implementation_plan.md` | Add phase or sub-phase for this change. Update Phase 16 to reference `/export`. |
| `docs/spec.md` | Update command descriptions and workflow diagram if present. |

## Migration

No data migration needed. Existing clean drafts in `drafts/patterns/` continue to work with `/publish` as-is. The change only affects the workflow going forward.

## Open Questions

1. **Name: `/export` vs `/commit-draft` vs `/stage`?** `/export` is concise and matches the "export gate" terminology already used. Open to alternatives.
2. **Should `/publish` subsume `/export`?** If `drafts/patterns/` is just an intermediate directory, `/publish` could handle the full path from `_local/drafts/` to `src/content/patterns/` in one step — creating the branch, stripping annotations, validating, and publishing. This would eliminate `drafts/patterns/` entirely. The argument against: keeping them separate preserves the PR review step between export and publication. The argument for: fewer commands, simpler flow. Recommend keeping them separate for now — the PR review step between draft and publication is valuable.
