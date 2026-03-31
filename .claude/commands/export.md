# /export — Export a Draft Pattern for Commit

Export a verified draft from `_local/drafts/` to `drafts/patterns/` on a feature branch. This command handles the transition from local annotated draft to committed clean artefact. Run this after reviewing and stripping annotations from a draft produced by `/draft`.

## Arguments

The operator should specify one of:
- A slug (e.g., `ner-newspapers`) — resolves to `_local/drafts/{slug}.md`
- A full path to a file in `_local/drafts/`

If not provided, list files in `_local/drafts/` and ask the operator which to export.

---

## Step 1 — Branch Gate

**This gate is mandatory. Do not skip it.**

Check the current branch:

```bash
git branch --show-current
```

**If on `master`:** Create a feature branch before continuing:

1. Check the state of local master against origin:
   ```bash
   git fetch origin master && git rev-list --left-right --count origin/master...HEAD
   ```
   - **Right > 0** (unpushed local commits): Warn the operator — "Local master has N unpushed commit(s). Push them before branching to avoid a divergent master." Do not proceed until resolved.
   - **Left > 0** (behind origin): Warn and offer to run `git pull --rebase origin master`.
   - **Both 0**: Proceed.

2. Determine the branch name from the slug: `feature/pattern-{slug}`.

3. Create and switch to the feature branch:
   ```bash
   git checkout -b feature/pattern-{slug}
   ```

4. Report to the operator: "Created feature branch `feature/pattern-{slug}`."

**If already on a feature branch:** Proceed silently.

**If on any other non-master branch:** Proceed, but note the branch name to the operator.

---

## Step 2 — Annotation Check

Run the annotation scanner against the local draft:

```bash
node scripts/check-draft.js _local/drafts/{slug}.md
```

**If annotations remain:** Halt immediately. Report the annotation count and instruct the operator:

> This draft still contains N annotation(s). Complete the review before exporting:
> 1. Open `_local/drafts/{slug}.md` and review each annotation against source material
> 2. Strip all `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers as you verify each one
> 3. Run `/export` again when all annotations are cleared

Do not proceed.

**If no annotations detected:** Proceed to Step 3.

---

## Step 3 — Strip and Copy

Even after manual review, residual annotation markers may remain (partial deletions, invisible characters, etc.). As a safety net:

1. **Read** `_local/drafts/{slug}.md`.
2. **Strip** any remaining `[EXTRACTED | ...]` and `[ELABORATED | ...]` markers from the content, leaving the surrounding text in place.
3. **Write** the clean file to `drafts/patterns/{slug}.md`.

---

## Step 4 — Verify

Run the annotation scanner against the exported file to confirm it is clean:

```bash
node scripts/check-draft.js drafts/patterns/{slug}.md
```

**If annotations are detected:** This indicates a bug in the stripping logic. Report the issue and halt — do not commit a file with annotations.

**If clean:** Proceed to Step 5.

---

## Step 5 — Commit

Offer to commit the clean draft on the feature branch:

```
## Export Complete

- **Source:** _local/drafts/{slug}.md
- **Exported to:** drafts/patterns/{slug}.md
- **Annotations:** clean (verified by check-draft.js)
- **Branch:** {current branch}

Ready to commit `drafts/patterns/{slug}.md` on this branch. Proceed?
```

If the operator confirms:
1. Stage the file: `git add drafts/patterns/{slug}.md`
2. Commit with a message like: `feat: add draft pattern {slug}`
3. Report success and suggest next steps: "Run `/publish` when ready to move to production."

If the operator declines: Acknowledge and end. The exported file remains in `drafts/patterns/` uncommitted.

## What NOT To Do

- Do not modify the annotated draft in `_local/drafts/` — it is the operator's review copy.
- Do not run `/publish` automatically — the operator decides when to publish.
- Do not commit source documents or include source file paths in the committed file.
- Do not proceed past the annotation check if annotations remain.
