---
title: "RO-Crate for Research Data Packaging"
pattern_id: RSE-HASS-002
alternative_names:
  - "Research Object Crate"
keywords:
  - metadata
  - data-packaging
  - JSON-LD
  - schema-org
  - FAIR
  - research-data-management
  - linked-data
hass_domains:
  - linguistics
  - musicology
  - anthropology
  - digital-humanities
version: "0.1.0"
author: mat-bettinson
last_updated: 2026-03-11
source_type: talk-transcript
source_ref: "PT Sefton RO-Crate presentation to vocabulary community working group"
confidence: 0.55
---

## Intent

Provide a standardised, portable way to package research data with descriptive metadata so that data collections are self-describing, not locked into any particular platform or storage system, and remain intelligible over time without depending on external services.

## Context

### When This Pattern Applies

- Research projects producing multi-file data collections (text, audio, images, spreadsheets, code) that need to be described, shared, or archived
- Cultural collections, linguistic archives, and other HASS datasets where data is heterogeneous and context-rich
- Situations where data may move between storage systems (file servers, object storage, institutional repositories) over its lifetime
- Projects that need to provide both machine-readable metadata and human-browsable previews of their data

### When This Pattern Does NOT Apply

- Data already managed by a domain-specific repository with its own metadata standards (e.g., institutional EDRMS) [ELABORATED]
- Ephemeral or transient data not intended for sharing or preservation [ELABORATED]
- Situations where metadata requirements are fully met by a single-file format with embedded metadata (e.g., GeoTIFF headers) [ELABORATED]

### Prerequisites

- A collection of digital files that need to be described and packaged together
- Familiarity with JSON (JavaScript Object Notation) or willingness to learn basic JSON-LD
- Understanding of schema.org vocabulary concepts (or domain-specific extensions)

## Issues

### Issue 1: Data Portability and Platform Lock-In

- Research data stored in proprietary systems or platform-specific formats risks becoming inaccessible when platforms change or funding ends [EXTRACTED — lines 10–11: "make sure that data is not locked into any particular storage system"]
- Data must be able to move between commodity file storage, object storage, and other systems without losing its descriptive context [EXTRACTED — lines 10–11]
- Long-lived projects (20+ years, as with PARADISEC) need formats that outlast any particular technology generation [EXTRACTED — line 9]

### Issue 2: No Standard for Describing Data Packages

- Given a directory or zip file of research data, there was historically no obvious standard for creating a manifest that describes the contents [EXTRACTED — lines 15–16: "given a zip file of data... there was no kind of obvious standard for doing this"]
- Researchers need both machine-readable metadata (for systems) and human-intelligible descriptions (for people) [EXTRACTED — lines 17, 21]
- File names alone are often meaningless without context [EXTRACTED — line 21: "you can also give the file a name rather than just having these obscure file names"]

### Issue 3: Sustainability vs Technology Lock-In

- Purpose-built applications (such as mobile apps for dictionary data) have short lifespans and stop working within a few years [EXTRACTED — line 23: "made as phone apps and they lasted a couple of years before they stopped working altogether"]
- Static, standards-based approaches survive longer but may seem less feature-rich initially [EXTRACTED — line 23: "completely static website... can be hosted with basically zero overhead"]
- The trade-off between rich interactivity and long-term sustainability must be explicitly managed [EXTRACTED — line 23: "that's a real trap — locking your data up into something like that"]

### Issue 4: Balancing Generality and Domain Specificity

- General-purpose vocabularies like schema.org cover common metadata needs but lack domain-specific terms [EXTRACTED — line 29: "at some point... schema.org doesn't cut it"]
- Domain communities need to extend metadata vocabularies without fragmenting interoperability [EXTRACTED — lines 31, 35]
- Extensions must be governed and maintained sustainably by their communities [EXTRACTED — line 35: "we have a committee, we have a persistent identifier"]

### Key Constraints

- Metadata must travel with the data — co-located, not stored in a separate system [EXTRACTED — line 11: "all the metadata that you need is stored with the data"]
- The packaging format must work with commodity storage (file systems, object stores) [EXTRACTED — line 10]
- Solutions should use existing web standards rather than inventing new ones [EXTRACTED — lines 17, 29]

## Motivating Example

**The Situation:**
Researchers at the Hawkesbury Institute at Western Sydney University were working with environmental data. They had data packaged in zip files but no standard way to create a manifest describing the contents. [EXTRACTED — lines 15–16]

**The Issues That Emerged:**
Without a descriptive manifest, recipients of the data could not easily determine what was in the package, what format the files were in, or how they related to each other. File names were opaque and the data lacked context. [EXTRACTED — lines 15–16, 21]

**Why Balance Is Needed:**
Any solution needed to be generic enough to work across disciplines and storage systems, yet expressive enough to capture meaningful metadata — and sustainable enough to outlast any particular technology platform. [EXTRACTED — lines 10–11, 23]

## Solution

### Core Idea

Place a JSON-LD metadata file (`ro-crate-metadata.json`) alongside data files in a directory or package. This file describes the contents using schema.org vocabulary, creating a self-describing data package — a "crate" — that is portable across storage systems and intelligible without external services. Optionally, include an HTML preview file that provides a human-browsable view of the crate's contents. [EXTRACTED — lines 16–22]

### Key Principles

1. **Metadata beside the data:** The JSON-LD metadata file lives in the same directory as the data it describes. Metadata and data travel together. [EXTRACTED — line 19: "you describe stuff with JSON and you put the JSON file beside the files"]
2. **Use existing web vocabularies:** Build on schema.org rather than inventing new metadata formats. Extend with domain-specific terms only where schema.org is insufficient. [EXTRACTED — lines 29, 31]
3. **Human and machine readable:** The JSON-LD file serves machines; the optional HTML preview serves people. Both are generated from the same metadata. [EXTRACTED — lines 17, 21]
4. **Storage-agnostic:** Crates work on file systems, object stores, zip files, or any commodity storage. No specialised infrastructure required. [EXTRACTED — lines 10–11]
5. **Static over dynamic:** Favour static representations (HTML files, JSON files) that can be hosted cheaply and survive indefinitely, over dynamic applications that require ongoing maintenance. [EXTRACTED — line 23]

### Solution Structure

```
my-research-data/
├── ro-crate-metadata.json    ← JSON-LD manifest (required)
├── ro-crate-preview.html     ← Human-browsable preview (recommended)
├── data-file-1.csv
├── data-file-2.jpg
└── recordings/
    ├── interview-01.wav
    └── interview-02.wav
```

The JSON-LD file contains entries for each file and entity, using schema.org properties (contentSize, dateModified, description, encodingFormat) and linking to external vocabularies (e.g., PRONOM format identifiers from the UK National Archives) where appropriate. [EXTRACTED — lines 17, 19]

### How the Issues Are Balanced

- **Issue 1 (Portability)** is balanced by: using commodity file/object storage with co-located metadata — no platform dependency [EXTRACTED]
- **Issue 2 (No standard)** is balanced by: adopting a single, well-defined packaging convention based on JSON-LD and schema.org [EXTRACTED]
- **Issue 3 (Sustainability)** is balanced by: favouring static files over dynamic applications — "the sort of thing that can go on GitHub Pages" [EXTRACTED]
- **Issue 4 (Generality vs specificity)** is balanced by: starting with schema.org and extending through governed domain vocabularies with persistent identifiers [EXTRACTED]

## Implementation Examples

### Example 1: PARADISEC Archive

**Context:** PARADISEC (Pacific and Regional Archive for Digital Sources in Endangered Cultures) manages 30,000+ records of cultural collections spanning linguistics, musicology, and anthropology from the Pacific region. The archive has been operational for 20+ years. [EXTRACTED — line 9]

**How They Balanced the Issues:** From the beginning, PARADISEC stored data on commodity file servers with metadata beside it (originally custom XML, now RO-Crate). This approach has sustained the archive through multiple technology generations. At scale, tens of thousands of crates are served from object storage with file-system backups. [EXTRACTED — lines 9, 25]

**What Worked Well:** The data has survived 20 years of technology change because it was never locked into a particular system. The transition to RO-Crate formalised and standardised what they had been doing intuitively. [EXTRACTED — lines 9–11]

### Example 2: Arandic Language Dictionary

**Context:** A dictionary project for Central Desert Arandic languages, combining paintings by a local artist with multilingual audio recordings of bird names in language. [EXTRACTED — line 23]

**How They Balanced the Issues:** Ben Foley built a static website from the RO-Crate metadata, replacing earlier phone apps that had stopped working within a few years. The static site can be hosted on GitHub Pages with essentially zero overhead. [EXTRACTED — line 23]

**What Worked Well:** The data and its presentation are now sustainable and portable, unlike the previous phone apps which required ongoing maintenance and became obsolete. [EXTRACTED — line 23]

### Example 3: ARDC Community Data Lab Projects

**Context:** Multiple projects funded by the Australian Research Data Commons in the community data lab space. [EXTRACTED — line 37]

**How They Balanced the Issues:** More than half of the funded projects adopted RO-Crate as their data interchange or storage mechanism, demonstrating broad community uptake. [EXTRACTED — line 37]

**What Worked Well:** RO-Crate provided a common interchange format across diverse projects. [EXTRACTED — line 37]

## Context-Specific Guidance

### For HASS Research

- Cultural collections often combine heterogeneous media (audio, images, text, paintings) — RO-Crate's format-agnostic approach handles this naturally without requiring all data to be in a single format [ELABORATED — inferred from PARADISEC and Arandic examples]
- HASS data frequently requires rich contextual description beyond what file names convey — the HTML preview feature supports non-technical stakeholders and community members [ELABORATED — inferred from line 21]
- Consider extending schema.org vocabulary with domain-specific terms (as the Language Data Commons of Australia does) rather than inventing bespoke metadata formats [EXTRACTED — lines 29–35]
- Where schema.org vocabulary is insufficient for your domain, maintain extensions with persistent identifiers and community governance [EXTRACTED — line 35]

### For Indigenous Research

**CARE Principles Application:** [ELABORATED — inferred from PARADISEC/Arandic examples and co-location principle]

- **Collective Benefit:** Self-describing data packages support community-controlled archives that remain intelligible without depending on external systems or institutions
- **Authority to Control:** RO-Crate metadata can encode access conditions and reuse terms alongside data, keeping governance information with the governed material
- **Responsibility:** Provenance metadata (who deposited, when, under what terms) travels with the data and cannot be separated from it
- **Ethics:** Cultural protocols and sensitivity classifications can be expressed in metadata; the static-site preview capability allows communities to control how their materials are presented

**Cultural Considerations:** [ELABORATED]
- The Arandic dictionary example demonstrates that cultural materials (art, language recordings) can be packaged with full community control over presentation
- Static websites generated from crates can be designed to respect cultural protocols around who sees what content

### For Different Scales

**Small Projects / Solo Researchers:** [ELABORATED]
- A single crate with a JSON metadata file and optional HTML preview is straightforward to create manually or with simple tooling

**Large Collaborative Projects:** [ELABORATED]
- PARADISEC demonstrates that RO-Crate scales to tens of thousands of records served from object storage
- Validation tooling (e.g., SHACL validators against RO-Crate profiles) becomes important at scale to ensure metadata consistency

## Consequences

### What You Gain

- Data is not locked into any particular storage system or platform [EXTRACTED — lines 10–11]
- Packages are self-describing and intelligible without external services [EXTRACTED — line 19]
- HTML previews make data browsable by non-technical stakeholders [EXTRACTED — lines 21, 23]
- Static hosting enables near-zero-cost, long-lived access ("the sort of thing that can go on GitHub Pages") [EXTRACTED — line 23]
- Metadata uses established web standards (schema.org, JSON-LD) with broad tooling support [EXTRACTED — lines 17, 29]

### What You Accept

- Overhead of creating and maintaining JSON-LD metadata alongside data [ELABORATED]
- Learning curve for schema.org vocabulary and JSON-LD conventions [ELABORATED]
- HTML previews require tooling to generate, though this can be automated [ELABORATED — inferred from line 23]
- The JSON-LD metadata is "not designed for reading by humans" — it serves machines, and human-facing views must be generated separately [EXTRACTED — line 17]

### Risks to Manage

- Metadata can drift out of sync with data if not validated regularly — mitigate with automated validation against RO-Crate profiles [ELABORATED — inferred from lines 43–47]
- Domain-specific vocabulary extensions may diverge across communities — mitigate by following established extension practices with persistent identifiers and community governance [EXTRACTED — line 35]
- Over-reliance on a single vocabulary (schema.org) — mitigate by maintaining governed domain extensions [EXTRACTED — lines 29–35]

## Known Uses

### Project 1: PARADISEC

- **Institution/Domain:** University of Melbourne, University of Sydney, ANU / Linguistics, Musicology, Anthropology
- **How They Used It:** Manages 30,000+ cultural collection records as RO-Crates on object storage with file-system backup, sustained over 20+ years [EXTRACTED — lines 9, 25]

### Project 2: Language Data Commons of Australia (LDaCA)

- **Institution/Domain:** Multi-institutional / Linguistics, Language Data
- **How They Used It:** Uses RO-Crate for packaging language data with domain-specific vocabulary extensions maintained via persistent identifiers and community governance [EXTRACTED — lines 31, 35]

### Other Examples

- ARDC Community Data Lab: More than half of funded projects use RO-Crate for data interchange or storage [EXTRACTED — line 37]
- European FAIR Digital Object implementations: Widely used in the European research scene, particularly in biosciences [EXTRACTED — line 37]

## Related Patterns

### Works Well With

- **[Version Control for Research](./version-control-for-research):** RO-Crate packages can be versioned in Git repositories, combining self-describing data with change tracking and audit trails [ELABORATED]
- **Vocabulary Management:** Domain-specific vocabulary extensions (as demonstrated by Language Data Commons) require their own governance and publishing practices [EXTRACTED — lines 29–35]

### Alternative Approaches

- **Dublin Core / DataCite metadata:** Simpler metadata standards that may suffice when data is single-file or the packaging aspect is unnecessary [ELABORATED]
- **Domain-specific repository formats:** Some domains have established repository systems with their own metadata standards that may make RO-Crate redundant [ELABORATED]

## Pitfalls to Avoid

### Anti-Pattern: Locking Data into Applications

- **What happens:** Research data is packaged inside purpose-built applications (e.g., mobile apps) rather than described with portable metadata [EXTRACTED — line 23]
- **Why it's problematic:** Applications stop working within a few years; the data becomes inaccessible when the app is no longer maintained [EXTRACTED — line 23]
- **Instead:** Describe data with RO-Crate metadata and generate applications (static sites, viewers) from the metadata [EXTRACTED — line 23]

### Common Mistake: Inventing Bespoke Metadata

- **Warning signs:** Creating custom XML or JSON schemas when schema.org (plus extensions) would suffice [EXTRACTED — lines 9, 29]
- **Guidance:** Start with schema.org vocabulary; extend only where genuinely needed; govern extensions with persistent identifiers and community processes [EXTRACTED — lines 29–35]

## Resources

### Further Reading

- RO-Crate specification: https://www.researchobject.org/ro-crate/
- schema.org vocabulary: https://schema.org/

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Alexander, C. (1979). *The Timeless Way of Building*. Oxford University Press.

Soiland-Reyes, S., Sefton, P., Crosas, M., Castro, L. J., Coppens, F., Fernández, J. M., Garber, D., Gruber, B., La Rosa, M., Leo, S., Ó Carragáin, E., Portier, M., Trisovic, A., Groth, P., & Goble, C. (2022). Packaging research artefacts with RO-Crate. *Data Science*, *5*(2), 97–138. https://doi.org/10.3233/DS-210053
