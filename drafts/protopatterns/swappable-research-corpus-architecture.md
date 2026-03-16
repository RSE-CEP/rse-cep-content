# Swappable Research Corpus Architecture

**ID:** A-003
**Type:** Architectural
**Description:** A corpus-agnostic RAG architecture that cleanly separates the query/generation pipeline from corpus-specific content, enabling researchers to substitute different document collections without modifying core application code — supporting comparative research and long-term reuse across institutional archives.
**Created:** 2026-03-16
**Last updated:** 2026-03-16

## Projects
- **ATLAS (AI as Infrastructure, ANU)** — explicitly designed so the default 1901 Hansard corpus (AU/NZ/UK) can be swapped out; achieves this via a corpus-agnostic manifest schema, environment-configured vector store, swappable retriever modules, and a `create/` directory with template scripts for building new corpora (Source: ATLAS Project documentation, AIINFRA, ANU, 2026-03-16)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| ATLAS Project documentation, AIINFRA, ANU | 2026-03-16 | Full architectural design: manifest schema, retriever abstraction, environment-configured corpus, create/ template workflow, multi-corpus metadata, explicit design principle ("code and documentation should be agnostic of the vector store content") |

## Notes
### From: ATLAS Project documentation, AIINFRA, ANU (2026-03-16)

**Explicit design statement:**
> "The default backend corpus (1901 Hansard from Australia, United Kingdom, Aotearoa / New Zealand) can be swapped out."
> "The code and documentation should be agnostic of the vector store content."

**Core architectural components:**

1. **Corpus-agnostic manifest schema (v1.1)**
   - JSON manifest at `backend/targets/manifest.json` captures: index name, embedding model, chunk size/overlap, inferred metadata field schema, and per-corpus statistics (files, chunks, chars, words)
   - Standardised fields avoid corpus-specific counters (e.g., "speeches," "sessions," "debates") so the schema is stable regardless of corpus domain
   - Backend API `/api/vector-store-info` reads manifest to auto-configure UI and inject stats into LLM context — without hardcoding corpus details
   - "Downstream consumers should ignore unknown keys" — forward-compatible schema design

2. **Retriever abstraction**
   - `RETRIEVER_MODULE` environment variable selects the retriever implementation (e.g., `hansard_retriever`)
   - Retriever classes are generated to match the vector store schema — created by `create/create_hansard_retriever.py` (or equivalent for other corpora)
   - Configuration flow: `config.py → base_target.py → {target}.txt files → retriever initialization`

3. **Environment-configured vector store**
   - `CHROMA_COLLECTION_NAME` env var selects active collection
   - `EMBEDDING_MODEL` must match the model used to build the store — enforced via manifest compatibility check
   - Composite target ID (`{TEST_TARGET}_{CHROMA_COLLECTION_NAME}`) tracks exact configuration for reproducibility

4. **Corpus creation template workflow:**
   - `create/` directory contains template scripts for new corpus ingestion (e.g., `create_hansard_store.py`, `create_hansard_retriever.py`)
   - Adding a new corpus: copy and adapt these scripts for the new domain (described for "novels, newspapers" as examples)
   - Outputs: vector store, `manifest.json`, `bm25_corpus.jsonl` — copied into `backend/targets/`
   - Ensures "retrievers are always in sync with your vector store schema"

5. **Multi-corpus within a single store:**
   - `MULTI_CORPUS_VECTORSTORE=True` and `MULTI_CORPUS_METADATA` env vars support multiple sub-collections in one vector store
   - Documents tagged with corpus metadata enables per-corpus filtering at query time
   - Example: `1901_au,1901_nz,1901_uk` as distinct filterable corpora

**Manifest-driven LLM context injection:**
- For "meta/store-stats questions," server injects a one-page manifest summary so the LLM can answer with exact corpus numbers (files, chunks, DB size, chunking params)
- "The LLM must only cite stats present in the manifest; it does not derive or infer counts" — the manifest is the ground truth, preventing hallucinated corpus statistics

**Parser registry pattern:**
- Corpus builders use a per-corpus parser registry that handles domain-specific input formats (XML for Hansard, potentially different formats for other corpora)
- Stats are tracked incrementally per-corpus during build; schema is inferred from emitted metadata fields
- Corpus-specific optional statistics kept under namespaced keys, not mixed with standardised schema

**Key evidence for HASS specificity:**
- Designed for comparative parliamentary research across national archives — the multi-corpus approach directly serves comparative HASS research methodology
- Intended for adaptation to other historical collections: "novels, newspapers" explicitly mentioned as future corpora
- Manifest design explicitly avoids domain-specific terminology ("speeches," "debates") to support heterogeneous HASS sources
- Corpus-agnostic architecture is a prerequisite for institutional collaboration where each partner brings a different archive
