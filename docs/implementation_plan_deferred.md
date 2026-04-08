## Phase x — Draft Review Tool (DEFERRED)

> **Deferred** pending validation of the `/draft` → `/export` workflow (Phase 16). The manual annotation review process provides equivalent functionality without tooling. This phase can be revived when the manual workflow proves cumbersome.

A local Node.js web interface for reviewing draft annotations. Resolves source pointers to display context on demand, writes annotation removals back to the markdown file. Operates on `_local/drafts/` — sits between `/draft` (which produces the annotated file) and `/export` (which requires annotations to be cleared).

- [ ] 17a — Create `scripts/review-server.js`:
  - Plain Node.js HTTP server (no framework), serves single-page wizard UI
  - Port 4323 (avoids clash with Astro dev on 4321)
  - Draft selection: list files in `_local/drafts/`
  - Annotation stepping: parse all annotations in selected draft, navigate prev/next/jump
  - Source panel (EXTRACTED only): resolve `ptr` field, read `.txt` file, slice line range + configurable buffer (default 3 lines either side). Clear error if pointer unresolvable.
  - Actions per annotation:
    - *Accept & clear* — remove annotation marker, leave content, write to file immediately
    - *Edit content* — inline editor pre-populated with annotated content, edit then accept, write to file
    - *Skip* — move to next without changes
  - Resume from first remaining annotation if operator returns mid-review
- [ ] 17b — Add `review` script to `package.json`: `"review": "node scripts/review-server.js"`
- [ ] 17c — Export integration:
  - After all annotations cleared, offer to invoke `/export` or prompt the operator to run it
  - Run `check-draft.js` to confirm no annotations remain before handoff
- [ ] 17d — Update `docs/ai-authorship-workflow.md`:
  - Add draft review tool section (usage, what it does, when to use it)
- [ ] 17e — Update `docs/spec.md`:
  - §3: add `review-server.js` to repo structure
  - §10: update operator workflow to reference `npm run review` as annotation review step

- [ ] 17f — Manual testing:
  - `npm run review` starts server on port 4323
  - Browser UI lists draft files from `_local/drafts/`
  - Selecting a draft shows annotations with progress indicator
  - EXTRACTED annotation: source panel resolves pointer and displays source context with buffer lines
  - EXTRACTED annotation with missing/invalid pointer: source panel shows clear error
  - *Accept & clear*: annotation marker removed from file, content preserved
  - *Edit content*: inline editor works, edited content + annotation removal written to file
  - *Skip*: moves to next annotation, skipped annotation remains in file
  - Reopening a partially reviewed draft resumes from first remaining annotation
  - After clearing all annotations, `/export` integration works and `check-draft.js` confirms clean
