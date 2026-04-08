---
title: "Co-Located Data and Metadata"
pattern_id: A-004
pattern_type: architectural
alternative_names:
  - "Self-Describing Data Packages"
keywords:
  - research-data-management
  - metadata
  - long-term-archival
  - data-portability
  - FAIR-data
  - data-packaging
hass_domains:
  - linguistics
  - anthropology
  - musicology
  - cultural-heritage
  - digital-humanities
author: mat-bettinson
last_updated: 2026-04-08
source_type: talk-transcript
source_ref: "RSE/CEP community presentation, 2026"
---

# Co-Located Data and Metadata

*An architectural principle for keeping research data interpretable and portable across systems and time*

**Alternative Names:** Self-Describing Data Packages

---

## Intent

Store machine-readable metadata in the same storage unit — directory, archive, or object — as the data it describes, so that the data remains interpretable and portable regardless of which system currently holds it.

---

## Context

### When This Pattern Applies

This pattern applies when:

- Research data is stored as collections of files in a file system, object storage, or portable archive format
- The data has a long archival horizon — years or decades — during which the originating storage system may be replaced, retired, or unavailable
- Data is intended for reuse, sharing, or deposit into a repository — by the same team later, or by others
- Data will move between storage backends over its lifetime (file server → object storage → archive → download)
- The research team cannot guarantee that a separate metadata catalogue or database will remain accessible alongside the data indefinitely

### When This Pattern Does NOT Apply

- When data is managed entirely within a purpose-built, institutionally governed repository with a stable API and no expectation of external portability — the repository system itself provides the interpretive context
- When data is strictly transient: intermediate pipeline outputs, scratch files, or computational artefacts not intended for reuse or archiving
- When metadata volume or structure is so complex (e.g., multi-terabyte sensor streams with continuous telemetry) that file co-location is architecturally impractical; dedicated time-series or telemetry storage systems may be more appropriate

### Prerequisites

- A metadata vocabulary or schema — whether a community standard (schema.org, Dublin Core), a domain extension (e.g. a linguistics vocabulary), or a project-defined structure
- Agreement on a machine-readable format for the metadata file (JSON-LD, XML, YAML, etc.)
- A policy or convention for when metadata is created and updated relative to the data

---

## Issues

### Issue 1: Long-Term Interpretability

Data stored without accompanying description becomes progressively harder to interpret as time passes: the researchers who created it leave, the system that managed it is decommissioned, and the contextual knowledge that made the files meaningful is no longer accessible. For long-lived collections spanning years or decades — common in humanities archives — this is an existential risk. Metadata held in a separate system that is later retired is functionally the same as no metadata.

- Why it matters: HASS collections frequently outlive the software, teams, and institutional contexts that produced them. A 20-year archive needs to remain interpretable across multiple generations of infrastructure.
- Who is affected: future researchers, archivists, repository managers, and the communities whose material is held.

### Issue 2: Storage System Independence

When metadata is held in a separate catalogue, database, or system, migrating the data to a new storage backend requires a parallel migration of the metadata — and the two can become misaligned or the metadata migration can fail entirely. The data arrives in the new system stripped of context. This creates a systemic fragility: the interpretability of the data is contingent on the continuous operation and migration of an external system.

- Why it matters: storage technologies change (file servers give way to object storage; systems are decommissioned; cloud providers retire services). Data that is not interpretable independently of its current storage system is at risk at every transition.
- Who is affected: infrastructure managers, repository operators, research teams handling data handover.

### Issue 3: Inadequacy of Ad-Hoc Metadata Practices

Many research projects manage their data description using spreadsheets (notably Microsoft Excel), word processor documents, README files, or directory naming conventions. This is understandable — these tools are familiar, low-barrier, and immediately available — and many researchers maintain careful, detailed records using them. However, ad-hoc metadata practices create several structural problems as data ages or changes hands:

- The metadata is not machine-readable in a standard way, so general tooling (validators, search indexers, repository ingest pipelines) cannot consume it without custom work per-project
- The metadata file may not travel with the data: a spreadsheet describing files in a directory can easily be separated from those files during copying, compression, or migration
- Format and software dependencies degrade over time: Excel files may not render correctly in future software, and proprietary encodings may not be interpretable by open-source tools
- With no shared vocabulary, two projects using the same ad-hoc approach produce incompatible metadata that cannot be aggregated, compared, or federated without manual harmonisation

This pattern does not preclude researchers from also maintaining human-readable summaries or documentation in familiar formats — it addresses the need for a machine-readable, co-located, structured layer that travels with the data independently.

- Why it matters: ad-hoc practices work well for the original researchers but fail the wider community — and often fail even the original researchers when they return to data years later.
- Who is affected: everyone who subsequently works with the data, including the original team.

### Key Constraints

- The metadata format must be machine-readable and based on a documented vocabulary — human-readable prose descriptions are valuable but insufficient for this pattern
- The co-location principle must be implemented at the level of the storage unit that travels together: the metadata file must be in the same directory, archive, or object prefix as the files it describes
- The pattern is technology-agnostic but requires commitment to a format and vocabulary; the specific choices should be guided by Implementation patterns (e.g., RO-Crate Research Data Packaging)

---

## Motivating Example

**The Situation:**

PARADISEC is an archive of cultural and linguistic materials from the Pacific region — recordings, images, and documents spanning linguistics, musicology, and anthropology. It was established with over 30,000 records and has been operating for more than 20 years. From the outset, the team made a founding architectural decision: all data would be stored on a file server with metadata beside it. They authored their own XML format and stored it together with the data files in the same directories.

In parallel, similar projects working with environmental and scientific data faced a common predicament: given a zip file of collected data, there was no obvious standard way to include a manifest or description of what was inside it. Anyone receiving the archive had to guess at the contents from file names, or rely on out-of-band communication with the original researchers.

**The Issues That Emerged:**

Projects that did not co-locate metadata with their data faced recurring problems at handover and archival time: the separate database or catalogue that described the data could not be guaranteed to accompany it; the people who held the contextual knowledge were not always available; and files archived to long-term storage without description became increasingly opaque.

The PARADISEC team's XML-beside-files approach, while bespoke, proved durable: the data and its description travelled together through multiple infrastructure generations, remaining interpretable even as the surrounding systems changed.

**Why Balance Is Needed:**

A fully ad-hoc approach (descriptive spreadsheet, naming convention, README document) provides some human-readable context but creates no machine-readable layer that tooling can consume, and offers no guarantee that the description travels with the data. A fully system-managed approach (all metadata in a separate catalogue or database) keeps the data clean but creates a coupling that is fragile at migration time. The pattern seeks a middle path: structured, machine-readable, co-located metadata that provides the benefits of both without the critical failure modes of either.

---

## Solution

### Core Idea

Place a machine-readable metadata file in the same storage unit — directory, archive, object prefix — as the data it describes. The metadata file uses a documented vocabulary whose terms are resolvable (ideally via URIs) to definitions that do not depend on proprietary software. The principle applies at any scale: a single directory with a handful of files, or tens of thousands of archival packages in object storage.

### Key Principles

1. **Co-location:** The metadata file lives in the same storage unit as the data it describes. It is not held in a separate system, database, or catalogue that must be independently maintained and migrated.

2. **Machine-readable format:** The metadata is structured in a format that general tooling can parse without custom per-project code — JSON-LD, XML, YAML, or similar. Human-readable summaries are complementary, not substitutes.

3. **Vocabulary-linked:** Metadata terms reference a documented vocabulary — standard (schema.org, Dublin Core) or domain-specific — using URIs that can be resolved to definitions. This enables interoperability across projects without prior coordination.

4. **Technology-agnostic:** The principle holds regardless of storage backend — file server, object storage, zip archive, USB drive. The metadata travels with the data by virtue of being in the same storage unit.

5. **Scalable:** The same structural principle applies from a single small collection to an institutional archive of tens of thousands of records.

### Solution Structure

```
Storage unit (directory / archive / object prefix)
│
├── data/
│   ├── recording-001.wav
│   ├── image-001.jpg
│   └── ...
│
└── metadata.json            ← co-located machine-readable metadata
    │
    └── vocabulary terms ──► external vocabulary URIs
                              (schema.org, domain vocab, format registry, ...)
```

The metadata file sits alongside the data files within the same storage boundary. Vocabulary terms are resolved via URIs that are external to the package — the package itself does not need to embed the vocabulary definitions.

### How the Issues Are Balanced

- **Long-Term Interpretability** is addressed by placing the metadata in the same storage unit as the data. When the data is archived, migrated, or handed over, the description travels with it. No external system needs to remain operational for the data to be interpretable.

- **Storage System Independence** is addressed by making the metadata a first-class file within the storage unit rather than a record in an external system. Any system that can hold the data can also hold the metadata; no migration coordination is required.

- **Inadequacy of Ad-Hoc Metadata Practices** is addressed by requiring a machine-readable, vocabulary-linked format. Unlike a spreadsheet or README, structured co-located metadata can be consumed by general tooling (validators, ingest pipelines, search indexers), travels with the data during copying and compression, and interoperates with other projects using the same vocabulary — without precluding the existence of human-readable documentation alongside it.

---

## Implementation Examples

### Example 1: PARADISEC — Custom XML at Archive Scale

**Context:** PARADISEC is a 20-year-old archive of Pacific cultural and linguistic materials — recordings, images, and documents across linguistics, musicology, and anthropology.

**How They Applied the Principle:**
From inception, data was stored on a commodity file server with bespoke XML metadata files in the same directories. The XML was not a standard format, but it embodied the co-location principle: the description travelled with the data, rather than being held in a separate database. This predates RO-Crate and represents a project-defined realisation of the architectural pattern.

**What Worked Well:** The collection has survived multiple infrastructure generations while remaining interpretable. The co-location choice insulated the archive from the metadata-loss risk that has affected contemporaneous projects that separated their data and catalogue systems.

**Link to Details:** https://www.paradisec.org.au/

### Example 2: PARADISEC — RO-Crate at Scale

**Context:** The same PARADISEC archive, updated infrastructure — now tens of thousands of packages delivered from a server, backed by object storage with file-directory backup.

**How They Applied the Principle:**
The archive migrated from bespoke XML to RO-Crate (JSON-LD with schema.org vocabulary), adopting a standard implementation of the same architectural principle. Each crate is a storage unit containing data files and an `ro-crate-metadata.json` file. The metadata travels with the data across both the object storage and the file-directory backup.

**What Worked Well:** The same architectural principle now benefits from standardised tooling, profile validation, and interoperability with other RO-Crate-using systems.

**Link to Details:** https://www.paradisec.org.au/

### Example 3: Language Data Commons of Australia

**Context:** A national language data infrastructure project managing collections of language materials with linguistics-specific metadata requirements not covered by schema.org.

**How They Applied the Principle:**
RO-Crate used as the packaging format, with a domain-specific vocabulary maintained under a W3ID persistent identifier to extend schema.org for linguistics terms (e.g. dialogue type, gesture, language-specific properties). The vocabulary is maintained with community governance following schema.org's practices.

**What Worked Well:** Domain extension via vocabulary URIs demonstrates that the architectural principle accommodates specialist metadata needs without abandoning interoperability — the domain terms are resolvable and documented, not ad-hoc.

**Link to Details:** https://www.ldaca.edu.au/

---

## Consequences

### What You Gain

- **Data survives storage migrations** — when the storage backend changes, the metadata migrates with the data automatically; no parallel catalogue migration is required
- **Data is independently interpretable** — anyone with access to the storage unit can understand what the data contains without needing access to an external system
- **Interoperability with tooling** — machine-readable structured metadata can be consumed by validators, ingest pipelines, search indexers, and discovery systems without per-project custom code
- **FAIR-aligned** — co-located, vocabulary-linked metadata directly supports Findability (rich description), Accessibility (description travels with data), Interoperability (shared vocabularies), and Reusability (rich provenance)
- **Scalable without architectural change** — the same structural principle applies from a single directory to tens of thousands of archival packages

### What You Accept

- **Metadata maintenance burden** — metadata files must be kept in sync with data changes (file additions, renames, deletions); without tooling or process discipline, metadata and data can drift out of alignment
- **Vocabulary commitment** — the pattern requires committing to a metadata vocabulary and format, which carries its own governance and maintenance obligations; changing vocabulary later may require re-describing the entire collection
- **More setup overhead than ad-hoc approaches** — creating structured metadata requires more initial effort than a spreadsheet or README; this investment pays off over long archival horizons but may feel disproportionate for short-lived or exploratory data
- **Format choice is not prescribed** — the architectural principle does not specify which format or vocabulary to use, so without a companion Implementation pattern (e.g., RO-Crate Research Data Packaging), teams may implement the principle incompatibly with each other

---

## Known Uses

### PARADISEC

- **Institution/Domain:** University of Sydney / University of Melbourne — linguistics, musicology, anthropology, Pacific cultural collections
- **How They Used It:** Metadata stored beside data files from inception; initially bespoke XML, later migrated to RO-Crate. Over 30,000 records.
- **Link:** https://www.paradisec.org.au/

### Language Data Commons of Australia

- **Institution/Domain:** ARDC-funded national infrastructure — Australian linguistics and language data
- **How They Used It:** RO-Crate packaging for language data collections, with a maintained domain vocabulary under a W3ID persistent identifier.
- **Link:** https://www.ldaca.edu.au/

### ARDC Community Data Lab Projects

- **Institution/Domain:** Australian Research Data Commons — broad HASS and sciences
- **How They Used It:** More than half of recently funded community data lab projects adopted RO-Crate as their data interchange or storage mechanism.
- **Link:** https://ardc.edu.au/

### European FAIR Digital Objects Community

- **Institution/Domain:** European research infrastructure — primarily life sciences, broader sciences
- **How They Used It:** RO-Crate adopted as an implementation vehicle for FAIR Digital Objects, embedding the co-location principle in European research data infrastructure.
- **Link:** https://www.fairdo.org/

---

## References

- Wilkinson, M. D., et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3, 160018. https://doi.org/10.1038/sdata.2016.18
- RO-Crate specification and community: https://www.researchobject.org/ro-crate/
- PARADISEC project: https://www.paradisec.org.au/
- Sefton, P., et al. (2023). RO-Crate: A lightweight approach to Research Object data packaging. *Data Science*, 5(2), 97–138. https://doi.org/10.3233/DS-210053
- schema.org vocabulary: https://schema.org/

---

**Template Version 2.0**
**Developed by:** CDL RSE Capacity Enhancement Project
**License:** CC BY 4.0
