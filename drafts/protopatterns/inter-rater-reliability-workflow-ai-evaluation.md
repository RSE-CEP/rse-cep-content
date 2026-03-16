# Inter-rater Reliability Workflow for AI-Assisted Research Evaluation

**ID:** P-003
**Type:** Process
**Description:** A structured process applying formal inter-rater reliability methodology to the evaluation of AI system outputs in research contexts — recruiting evaluators from the research team, allocating sessions deterministically to prevent self-rating and ensure fair coverage, collecting independent multi-rater judgements across structured evaluation dimensions, and storing annotations in a way that supports inter-rater agreement analysis.
**Created:** 2026-03-16
**Last updated:** 2026-03-16

## Projects
- **ATLAS (AI as Infrastructure, ANU)** — implements inter-rater evaluation for LLM RAG responses over 1901 parliamentary records; authenticated users are assigned sessions they did not originally generate; 9-dimension evaluation rubric (Factual Accuracy, Corpus Fidelity, Analysis Quality, Relevance, Difficulty, Clarity, User Type, Comments, Faults); Phoenix Arize stores annotations with labelled prefixes and anonymous user IDs; exercised with research teams of 2–10+ users (Source: ATLAS Project documentation, AIINFRA, ANU, 2026-03-16)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| ATLAS Project documentation, AIINFRA, ANU | 2026-03-16 | Full inter-rater workflow: evaluation rubric (9 fields), deterministic allocation algorithm, self-exclusion logic, team sizing guidance, coverage calculation formula, workload estimation, anonymity requirements, Phoenix integration for annotation storage |

## Notes
### From: ATLAS Project documentation, AIINFRA, ANU (2026-03-16)

**The research methodology motivation:**
- Humanities and social science research evaluation norms require inter-rater reliability (IRR) as a measure of evaluation validity
- Applying IRR to AI system output evaluation brings HASS research rigour to what would otherwise be single-evaluator, potentially biased quality assessment
- The ATLAS inter-rater system is built into the research tool itself — evaluation is not a separate offline process

**Evaluation rubric — 9 dimensions (all captured for both primary and inter-rater):**
1. Factual Accuracy (1–5 Likert)
2. Corpus Fidelity — how well the response aligns with retrieved source documents (1–5 Likert)
3. Analysis Quality (1–5 Likert)
4. Relevance (1–5 Likert)
5. Difficulty — user-assessed question complexity (1–5 Likert)
6. Clarity (1–5 Likert)
7. User Type (Expert / Non-expert) — important for interpreting other ratings in context
8. Comments (free text)
9. Faults (checkboxes: hallucination, off_topic, inappropriate, bias)

**Allocation algorithm — deterministic user-specific allocation:**
> "Each user gets a consistent set of sessions (same user → same sessions). Different users get different, non-overlapping sessions. Fair distribution across all available sessions."

Process:
1. All eligible sessions sorted by `span_id` for consistent ordering
2. User's identity hashed to generate a starting position in the list
3. Starting from hash position, allocate N sessions sequentially (N = INTER_RATER_SESSIONS_PER_USER)
4. Wrap around at end of list (modulo operation)

Exclusion rules applied before allocation:
- **Only sessions with existing feedback** are in the pool (no empty sessions)
- **Self-exclusion**: sessions authored by this user are excluded
- **No duplicate rating**: sessions already inter-rated by this user excluded
- **Capacity cap**: sessions at INTER_RATER_MAX_RATINGS (default: 3) removed from pool

**Team size configurations:**

Small teams (2–5 users):
```
INTER_RATER_MAX_RATINGS=2
INTER_RATER_SESSIONS_PER_USER=10
```
Medium teams (5–10 users) — recommended:
```
INTER_RATER_MAX_RATINGS=3
INTER_RATER_SESSIONS_PER_USER=5
```
Large teams (10+ users):
```
INTER_RATER_MAX_RATINGS=5
INTER_RATER_SESSIONS_PER_USER=3
```

**Coverage and workload estimation formulas:**
```
Minimum users needed = (N sessions × INTER_RATER_MAX_RATINGS) / INTER_RATER_SESSIONS_PER_USER
Time per user = SESSIONS_PER_USER × 5–10 minutes
```
Example: 20 sessions, MAX_RATINGS=3, SESSIONS_PER_USER=5 → 12 users needed; ~25–50 min workload each

**Anonymity requirements:**
- Authentication is required (Cognito or Cloudflare) so user identity can be established for self-exclusion — but identity is never stored
- Anonymous IDs (`anon_<16-hex>`) derived from stable identity with environment-specific salt
- Inter-rater sees questions and AI responses but not original rater identity
- Temporal separation possible between original rating and inter-rating
- "Pattern obfuscation: deterministic but unpredictable allocation prevents gaming"

**Annotation storage design:**
- Inter-rater annotations stored in Phoenix with numbered prefixes: `[inter-rating-1]`, `[inter-rating-2]`, `[inter-rating-3]`
- Unique annotation IDs include inter-rater number to prevent overwrites
- Annotations attached to original QA span — enables correlation of original and inter-rater assessments
- Metadata flags: `is_inter_rater=true`, `rater_id=<anon_id>`, `inter_rater_number=<N>`, `original_span_id`

**Session lifecycle:**
- Sessions auto-enter allocation pool when initial feedback annotation exists
- Sessions auto-exit pool when they reach INTER_RATER_MAX_RATINGS capacity
- User cache invalidated immediately after submission so counts update without stale state
- System "self-balances": sessions near capacity get fewer new allocations

**Key evidence for HASS specificity:**
- Corpus Fidelity dimension is specific to archival/historical research — it measures how grounded the AI response is in the retrieved historical sources, directly addressing historian concerns about hallucination vs. evidence-based response
- User Type (Expert/Non-expert) dimension captures the disciplinary context of the evaluator — relevant for HASS where domain expertise is unevenly distributed across research teams
- Difficulty rating supports calibration across question types, important for complex HASS queries about historical interpretation
- The inter-rater process itself mirrors established humanities research practice (inter-coder reliability in qualitative research)
