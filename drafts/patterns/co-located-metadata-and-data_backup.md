---
title: "Co-Located Metadata and Data"
pattern_id: A-004
pattern_type: architectural
keywords:
  - metadata
  - data-packaging
  - portability
  - archival
  - long-term-preservation
  - FAIR
hass_domains:
  - linguistics
  - musicology
  - anthropology
  - digital-humanities
author: Mat Bettinson
last_updated: 2026-03-17
source_type: talk-transcript
source_ref: "Peter Sefton, RO-Crate overview talk (YouTube)"
---

# Co-Located Metadata and Data

*An architectural principle for ensuring that data collections remain self-describing and portable across storage systems and institutional lifespans.*

---

## Pattern Metadata

| Field | Value |
|-------|-------|
| **Pattern ID** | A-004 |
| **Pattern Type** | Architectural |
| **Keywords** | metadata, data-packaging, portability, archival, long-term-preservation, FAIR |
| **Author(s)** | Mat Bettinson |
| **Last Updated** | 2026-03-17 |

---

## Intent

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: proto-pattern description and core principle | "store all their data on a file server with metadata beside it… the aims are to make sure that data is not locked into any particular storage system"]

Store machine-readable metadata in the same package or directory as the data it describes, so that data collections remain self-describing and portable across storage systems without depending on an external metadata service.

---

## Context

### When This Pattern Applies

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "HASS relevance" section of proto-pattern]

- Long-lived HASS collections (linguistics, musicology, anthropology, digital humanities) that must outlive individual projects, funding cycles, and institutional systems
- Projects where data is stored on commodity or object storage (file systems, S3-compatible object stores, institutional repositories)
- Contexts where storage systems are expected to change over time, or where data may be transferred between custodians
- Any collection where the value of the data depends on preserving its contextual description alongside the data itself

### When This Pattern Does NOT Apply

[ELABORATED | basis: logical contrapositive of the pattern's stated goals; general archival practice]

- Transient or short-lived datasets where portability and long-term preservation are not requirements
- Systems where data is natively stored in a relational database that already embeds metadata as schema columns — co-location is the architecture, not a separate metadata file
- Contexts where metadata is legally or ethically required to be maintained separately from data (e.g., certain privacy-governed datasets where metadata must be accessible without the underlying data)

### Prerequisites

[ELABORATED | basis: implied by format-agnostic framing and PILARS reference in proto-pattern]

- Agreement on a metadata vocabulary or schema (format is flexible — XML, JSON-LD, YAML; any machine-readable format works)
- Storage system that allows files to exist alongside data items (true of almost all file-based and object storage systems)
- Governance agreement on who is responsible for keeping metadata current as data evolves

---

## Issues

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Problem it solves", "storage-agnostic framing", and "HASS relevance" sections of proto-pattern]

### Issue 1: Data Portability Across Storage Systems

Datasets must remain usable when moved between storage technologies — file systems, object storage, cloud platforms, institutional repositories. If the metadata lives only in an external database or catalogue, a storage migration severs the link between data and its description. The data arrives at its destination stripped of context.

### Issue 2: Metadata Loss at System Retirement

Institutional systems — catalogues, data management platforms, funding-project databases — have lifespans shorter than the data they describe. When a system is retired, metadata held only in that system is at risk of loss or disconnection from the data it describes. Once separated, the link is rarely recovered.

### Issue 3: Long-term Preservation Without Institutional Continuity

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "HASS relevance" section | "Particularly important for long-lived HASS collections… where data must outlive individual projects, funding cycles, and institutional systems. PARADISEC's 20-year survival is cited as evidence."]

HASS collections in linguistics, musicology, and anthropology are expected to remain usable decades after initial capture, often outliving the project team, institution, or funding body. Preservation requires that meaning be embedded in the collection itself, not held by a service that may not exist.

### Key Constraints

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Distinction from implementation" section of proto-pattern]

- The principle must be format-agnostic: different projects will use different metadata vocabularies and serialisations. The architectural constraint is co-location, not format.
- The principle must be storage-agnostic: it must work on file systems, object storage, and any future storage technology.

---

## Motivating Example

**The Situation:**

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Origin story" section of proto-pattern]

A research team at Western Sydney University managing environmental data from the Hawkesbury Institute for the Environment needed to store field data in a way that would remain interpretable over time. No obvious standard existed at the time for bundling data with a description manifest.

**The Issues That Emerged:**

[ELABORATED | basis: WSU Hawkesbury mentioned as early motivating use case in proto-pattern; no direct quotes available]

Without a co-location standard, the team faced the prospect of metadata living in a separate system. If that system was not maintained alongside the data, future researchers encountering the raw data files would have no way to interpret them.

**Why Balance Is Needed:**

Metadata storage is often treated as a secondary concern relative to the data itself. The cost of separating them is not felt immediately — it accumulates over time as systems drift and people move on. By the time the separation becomes a problem, the people who understood the original context may no longer be reachable.

---

## Solution

### Core Idea

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: core principle section of proto-pattern | "if you're storing stuff, you put the metadata with it. So all the metadata that you need is stored with the data."]

Store metadata in the same package, directory, or object prefix as the data it describes. When data moves — to a new storage system, a new institution, or a new custodian — the metadata moves with it automatically. The package is self-describing.

### Key Principles

[ELABORATED | basis: "distinction from implementation" and "storage-agnostic framing" sections of proto-pattern]

1. **Metadata travels with data.** The metadata file or record is stored in the same directory, object prefix, or package as the data it describes. Moving or copying the data automatically includes its description.
2. **Format-agnostic.** The architectural principle does not prescribe a metadata format. PARADISEC has used bespoke XML for 20 years; RO-Crate uses JSON-LD. What matters is that metadata is machine-readable and co-located, not which vocabulary or serialisation is used.
3. **Self-describing packages.** Each data package carries enough metadata to be understood in isolation — without querying an external system. A new repository, researcher, or tool receiving the package can understand its contents from the package itself.

### Solution Structure

[ELABORATED | basis: structural illustration of the principle]

```
Data Package (directory or object prefix)
├── data/
│   ├── item-001.wav
│   ├── item-002.wav
│   └── ...
└── metadata.json   ← co-located metadata file
    (describes items, provenance, rights, relationships)

When moved to new storage:
[Old storage] ──copy──► [New storage]
    package                 package (metadata intact)

Contrast with external metadata store:
[Old storage]   [Metadata DB]   → system retired → metadata lost
    data ───────────╳
```

### How the Issues Are Balanced

- **Data Portability** is balanced by: metadata travels with data as a first-class part of the package; no external query is required after transfer
- **Metadata Loss at System Retirement** is balanced by: metadata survives any storage system change because it is not held by the system — it is held by the package
- **Long-term Preservation** is balanced by: collections that are self-describing remain interpretable even when all original project infrastructure has been decommissioned

### Values and Considerations

**When choosing a metadata format:**
- ✓ Consider: machine-readability and longevity (plain text, XML, JSON-LD are all valid choices with different ecosystem support)
- ✓ Consider: shared vocabularies (schema.org, Dublin Core, domain-specific standards) to support interoperability when packages are exchanged
- ✓ Weigh: community adoption of emerging standards (RO-Crate) against the proven longevity of simpler formats

**When implementing co-location:**
- ✓ Ensure: metadata covers enough context for the package to be understood without external reference
- ✓ Balance: completeness of metadata at creation time vs. burden on researchers to produce it

---

## Implementation Examples

### Example 1: PARADISEC — Pacific and Regional Archive for Digital Sources in Endangered Cultures

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" and "Notes" sections of proto-pattern | "they did right from the beginning was to store all their data on a file server with metadata beside it"]

**Context:** Long-running digital archive for endangered language recordings and cultural materials, operating for approximately 20 years.

**How They Balanced the Issues:** PARADISEC stores audio, video, and document files on commodity file storage with bespoke XML metadata beside each item. The same principle has been maintained as their storage backend evolved to object storage — the co-location approach works identically in both contexts. Data and metadata live together regardless of the underlying storage technology.

**What Worked Well:** The archive has survived multiple storage system changes over 20 years without loss of metadata linkage. The collection remains interpretable because meaning is embedded in the packages, not in an external catalogue alone.

### Example 2: Language Data Commons of Australia (LDaCA)

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" section of proto-pattern]

**Context:** National infrastructure for Australian language research collections, including dictionaries and community language materials.

**How They Balanced the Issues:** LDaCA applies the co-location principle at scale using RO-Crate as the metadata standard. Language collections are packaged as self-describing crates — each collection carries its RO-Crate metadata file alongside the data, making collections portable and independently interpretable.

**What Worked Well:** Adoption of a shared standard (RO-Crate) extends the principle into an ecosystem: tools built for RO-Crate can consume any LDaCA collection without project-specific integration.

### Additional Examples

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" section of proto-pattern]

- **Hawkesbury environmental data (WSU):** Early use case that motivated formalising the principle; absence of a standard at the time demonstrated the need for a common approach.

---

## Context-Specific Guidance

### For HASS Research

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "HASS relevance" section of proto-pattern]

- Particularly important for collections in linguistics, musicology, and anthropology where materials document cultural practices, language, and knowledge that may not exist elsewhere
- The longer the expected lifespan of a collection, the more important co-location becomes — five-year project infrastructure will not outlive 50-year archival data
- FAIR principles are directly supported: co-located metadata makes collections Findable (metadata present), Accessible (metadata travels with data), Interoperable (shared vocabularies), Reusable (full description available)
- Formalised implementations such as PILARS (Protocols for Implementing Long-term Archival Repository Services) provide governance frameworks built on this principle

### For Indigenous Research

[ELABORATED | basis: general CARE alignment logic; no specific Indigenous context in source material]

**CARE Principles Application** (Carroll et al., 2020):
- **Collective Benefit:** Co-located metadata ensures that community-held data retains its contextual description across any institutional transfer, supporting ongoing community access and benefit
- **Authority to Control:** When metadata travels with data, communities can review and update descriptions as custodianship changes or cultural protocols evolve — the description is not locked in an external service controlled by a third party
- **Responsibility:** Custodians applying this pattern bear responsibility for ensuring co-located metadata accurately reflects community-approved descriptions and access conditions
- **Ethics:** Metadata co-located with data may include access restrictions or cultural sensitivity markers. Ensure that metadata files themselves do not inadvertently expose restricted information when the data they describe is access-controlled

**Cultural Considerations:**
- Metadata vocabularies should reflect community naming conventions and knowledge organisation, not solely institutional or library classification systems
- Co-located metadata can embed access tier information so that data packages carry their own access conditions (see Community-Delegated Access Control)

### For Different Scales

**Small Projects / Solo Researchers:**
- Even a minimal README or plain-text metadata file beside data items provides meaningful co-location; formal vocabularies are valuable but not required to apply the principle
- Starting with co-location from the beginning is far less costly than retrofitting it when the project is complete

**Large Collaborative Projects:**
- Establish a shared metadata schema and validation workflow early; co-location without schema agreement produces inconsistent packages that are harder to exchange
- Consider RO-Crate or a domain standard as the co-location format to gain tooling ecosystem support

---

## Consequences

### What You Gain

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "storage-agnostic framing" and "problem it solves" sections of proto-pattern]

- ✅ **Storage independence:** data can be migrated between storage systems without losing its description
- ✅ **Institutional independence:** collections remain interpretable when original project infrastructure is retired
- ✅ **Self-contained packages:** any recipient of a data package can understand its contents without contacting the originating system
- ✅ **FAIR alignment:** co-location directly supports Findable, Accessible, Interoperable, and Reusable principles
- ✅ **Proven longevity:** 20+ years of PARADISEC operation is evidence that the principle scales and survives

### What You Accept

[ELABORATED | basis: logical consequences of the pattern; standard archival preservation concerns]

- ⚖️ **Metadata maintenance burden:** co-located metadata must be kept in sync with the data as it evolves. No external system enforces this; it depends on workflow discipline.
- ⚖️ **Format variety:** without an enforced vocabulary standard, different projects may co-locate metadata in incompatible formats, limiting interoperability even when the principle is followed.

### Risks to Manage

[ELABORATED | basis: logical consequences of the pattern; standard archival preservation concerns]

- ⚠️ **Stale metadata:** if data changes but metadata is not updated, the package becomes inconsistent → mitigate with validation tooling that checks metadata-data correspondence
- ⚠️ **Incomplete metadata:** co-location does not guarantee completeness → pair with a minimum metadata schema and validation gate
- ⚠️ **Access control gaps:** metadata files may be inadvertently more accessible than the data they describe → ensure storage-layer access controls apply equally to metadata and data files

---

## Known Uses

### PARADISEC

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" and "Notes" sections of proto-pattern]

- **Institution/Domain:** Pacific and Regional Archive for Digital Sources in Endangered Cultures; linguistics and cultural heritage
- **How They Used It:** Bespoke XML metadata stored beside data items on file and object storage; approach maintained continuously for approximately 20 years through multiple storage system generations
- **Link:** https://www.paradisec.org.au/

### Language Data Commons of Australia (LDaCA)

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" section of proto-pattern]

- **Institution/Domain:** National research infrastructure; Australian language research and digital humanities
- **How They Used It:** RO-Crate used as the co-location metadata standard at scale across language dictionaries and community collections
- **Link:** https://www.ldaca.edu.au/

### Hawkesbury Environmental Data (WSU)

[EXTRACTED | source: "Peter Sefton YT Talk on RO-Crate" | ref: "Projects" section of proto-pattern]

- **Institution/Domain:** Western Sydney University; environmental science
- **How They Used It:** Early motivating use case for formalising the co-location principle; contributed to the development of PILARS

---

## Related Patterns

No published patterns in the index — skipping related pattern proposals.

### Works Well With

- **RO-Crate for Research Data Packaging (I-005):** RO-Crate is the leading implementation of this architectural principle — a JSON-LD metadata file co-located with data, using schema.org vocabularies. Applying A-004 architecturally and I-005 as the implementation is a natural pairing.

### Typical Sequence

```
[Co-Located Metadata and Data (A-004)] → [RO-Crate for Research Data Packaging (I-005)]
Architectural principle                    Concrete implementation choice
```

---

## Pitfalls to Avoid

### Anti-Pattern: Metadata-Only Repository

- **What happens:** A project stores all metadata in a central catalogue or database, with data held separately on bulk storage. The catalogue reference (a URL or identifier) is stored with the data.
- **Why it's problematic:** When the catalogue is retired or its URL scheme changes, the link breaks. The data becomes opaque. This has happened repeatedly in research infrastructure.
- **Instead:** Store a copy of the essential metadata alongside the data. The catalogue can provide discovery and query, but the package must be self-describing.

### Common Mistake: Co-Location Without Schema

- **Warning signs:** Different data producers in the same project use different metadata file names, formats, or field names for the same concepts
- **Guidance:** Agree a minimum metadata vocabulary and file naming convention before data collection begins. Co-location is the structural principle; a shared vocabulary is what makes co-located metadata interoperable.

---

## Resources

### Further Reading

- PILARS (Protocols for Implementing Long-term Archival Repository Services) — governance framework built on the co-location principle
- RO-Crate specification: https://www.researchobject.org/ro-crate/
- Sefton, P. et al. (2022). RO-Crate: A lightweight approach to Research Object Data Packaging. *Data Science Journal*, 21(1). https://doi.org/10.5334/dsj-2022-001
- FAIR Principles: Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3, 160018. https://doi.org/10.1038/sdata.2016.18

---

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://doi.org/10.5334/dsj-2020-043

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.
