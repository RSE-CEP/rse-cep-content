# Hybrid Search for Historical Text Corpora

**ID:** I-004
**Type:** Implementation
**Description:** Combining BM25 lexical search with dense vector retrieval via Reciprocal Rank Fusion (RRF), using period-specific fine-tuned embedding models, to improve retrieval quality for historical text corpora where vocabulary, spelling, and usage diverge from modern language.
**Created:** 2026-03-16
**Last updated:** 2026-03-16

## Projects
- **ATLAS (AI as Infrastructure, ANU)** — implements hybrid search (BM25 + dense via RRF) over 1901 parliamentary records from Australia, New Zealand, and the United Kingdom; uses `Livingwithmachines/bert_1890_1900` (a BERT model fine-tuned on 1890–1900 text) as the embedding model; configurable SEARCH_K (15–40 chunks) and multi-corpus filtering (Source: ATLAS Project documentation, AIINFRA, ANU, 2026-03-16)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| ATLAS Project documentation, AIINFRA, ANU | 2026-03-16 | Full implementation details: BM25 via `rank-bm25`, dense vector via ChromaDB + Sentence Transformers, RRF fusion, `bert_1890_1900` fine-tuned embedding model, chunk size/overlap configuration, multi-corpus metadata filtering, SEARCH_K parameter trade-offs |

## Notes
### From: ATLAS Project documentation, AIINFRA, ANU (2026-03-16)

**Core technology stack:**
- Dense retrieval: ChromaDB vector store + Sentence Transformers (BERT-based)
- Lexical retrieval: `rank-bm25` Python library; BM25 corpus stored as `bm25_corpus.jsonl` aligned with the vector store
- Fusion: Reciprocal Rank Fusion (RRF) combines ranked results from both retrieval paths
- Hybrid mode is configurable (can run dense-only or hybrid depending on environment settings)

**Period-specific embedding model:**
- Default embedding: `Livingwithmachines/bert_1890_1900` — a BERT model fine-tuned on digitised text from 1890–1900
- The model handles historical spelling, vocabulary, and register that standard models struggle with
- Embedding dimension: 768 (standard BERT)
- Fallback: if fine-tuned model files are unavailable, system falls back to mean pooling
- Multiple pooling strategies supported: mean, cls, mean+max

**Chunking and vector store configuration:**
- Text splitter: `RecursiveCharacterTextSplitter`, chunk size 1000, overlap 100
- Vector store generation tracked via a manifest (`manifest.json`) that records model, chunking params, and per-corpus statistics
- Composite collection name ties together LLM target + vector store for reproducibility

**SEARCH_K parameter and trade-offs (from test_targets.md):**
> "The SEARCH_K parameter directly affects memory usage and response quality"
- k15: ~15KB context per query (memory efficient)
- k20: ~20KB (balanced)
- k30: ~30KB (comprehensive but memory intensive)
- k40+: high memory usage, not recommended for concurrent-user scenarios

**Multi-corpus filtering:**
- Multi-corpus vector store: documents tagged with corpus metadata (e.g., `1901_au`, `1901_nz`, `1901_uk`)
- Post-retrieval filtering by corpus tag supports single-corpus or all-corpus queries
- MULTI_CORPUS_VECTORSTORE and MULTI_CORPUS_METADATA env vars configure corpus composition

**Load testing insight — semantic vs HTTP success:**
- Load tests track both HTTP success rate (network level) and *semantic success rate* (meaningful content generated, excludes zero-token responses)
- At k20 for Gemini 2.0: "33% memory reduction vs k30" with acceptable semantic quality
- Semantic success rate target: >95% at 30 concurrent users on 8vCPU/16GB hardware

**Key evidence for HASS specificity:**
- The choice of `bert_1890_1900` directly addresses the linguistic gap between modern language models and historical parliamentary text
- Default corpus is 1901 parliamentary records; system designed so corpus can be swapped (see also: Swappable Research Corpus Architecture, A-003)
- Multi-corpus support designed for comparative parliamentary research across national archives
