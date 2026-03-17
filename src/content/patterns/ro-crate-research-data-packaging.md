---
title: "RO-Crate for Research Data Packaging"
pattern_id: I-005
pattern_type: implementation
alternative_names:
  - "Research Object Crate"
  - "RO-Crate"
keywords:
  - ro-crate
  - JSON-LD
  - metadata
  - data-packaging
  - research-objects
  - FAIR
  - static-publication
  - schema.org
  - linked-data
hass_domains:
  - linguistics
  - musicology
  - anthropology
  - digital-humanities
  - cultural-heritage
author: Mat Bettinson
last_updated: 2026-03-17
source_type: talk-transcript
source_ref: "Peter Sefton, RO-Crate overview talk (YouTube)"
---

# RO-Crate for Research Data Packaging

*A concrete implementation of co-located metadata and data using JSON-LD and optional HTML preview to make research data collections self-describing, portable, and human-accessible.*

**Alternative Names:** Research Object Crate, RO-Crate

---

## Pattern Metadata

| Field | Value |
|-------|-------|
| **Pattern ID** | I-005 |
| **Pattern Type** | Implementation |
| **Keywords** | ro-crate, JSON-LD, metadata, data-packaging, research-objects, FAIR, static-publication, schema.org |
| **Author(s)** | Mat Bettinson |
| **Last Updated** | 2026-03-17 |

---

## Intent

Package a research data collection as a self-describing object by placing a JSON-LD metadata file (`ro-crate-metadata.json`) alongside the data, with an optional HTML file that provides a human-readable preview — making the collection portable, machine-readable, and immediately interpretable without external infrastructure.

---

## Context

### When This Pattern Applies

- Research projects in linguistics, digital humanities, musicology, anthropology, and cultural heritage with long-lived collections
- Data packaged on file systems, object storage, or institutional repositories that needs to be portable and self-describing
- Teams publishing collections as static websites or depositing them in FAIR-compliant repositories
- Any scale — from a single dictionary project to a multi-thousand-item archive

### When This Pattern Does NOT Apply

- Transient datasets where portability is not a concern and the collection will be discarded after analysis
- Data managed in a relational database system where the schema itself serves as the metadata (co-location is architectural, not a separate file)
- Real-time or streaming data pipelines where file-based packaging is not the natural representation

### Prerequisites

- Familiarity with JSON or JSON-LD, or access to tooling that generates it (see Resources)
- Agreement on metadata vocabulary: schema.org as base, plus any domain-specific extensions needed
- File-based or object storage system where `ro-crate-metadata.json` can be co-located with data

---

## Issues

### Issue 1: Machine-Readability vs. Human Accessibility

JSON-LD metadata is machine-readable but opaque to researchers, archivists, and community members who need to understand what a package contains. A metadata file alone creates a two-tier collection: interpretable by tools, inaccessible to humans without further infrastructure.

- Who is affected: researchers receiving packages, community members, archivists
- Why it matters: a collection that cannot be understood without specialist tooling is not genuinely accessible

### Issue 2: General Vocabulary Coverage vs. Domain Specificity

schema.org provides a well-supported, machine-readable vocabulary for common properties (file size, dates, descriptions, authorship) but does not cover domain-specific concepts in linguistics, musicology, or cultural heritage. Domain-specific terms — e.g., dialogue type, gesture, handwritten vs. audio — are essential for describing HASS collections but absent from the general vocabulary.

- Who is affected: domain researchers, tools consuming domain-specific metadata
- Why it matters: using only general vocabulary produces shallow metadata that cannot represent the nuance of the domain

### Issue 3: Archival Longevity vs. Technology Dependencies

Research data must remain accessible over long timeframes — decades, not years. Technologies that package or present data in ways that depend on maintained infrastructure (apps, web services, proprietary tools) routinely fail before the research communities that depend on them.

- Who is affected: language communities, future researchers, archival custodians
- Why it matters: format and platform choices made now determine whether data is accessible in 20 years

### Key Constraints

- The `ro-crate-metadata.json` file must be valid JSON-LD and reference the RO-Crate specification context
- Domain vocabulary extensions should use persistent identifiers (W3ID or equivalent) so extensions remain resolvable over time
- Storage technology is unconstrained — file system, object store, and archival repository contexts are all valid

---

## Motivating Example

**The Situation:**

A project documenting an Arandic language community produced a dictionary combining images, audio recordings of speakers, and textual entries. Historically, such resources were often packaged as phone applications — the obvious choice for a format people would use to access the dictionary.

**The Issues That Emerged:**

Phone apps built for one operating system version become unmaintainable as platforms evolve. Apps funded for a specific project period typically have no maintenance budget once the grant ends. A dictionary that worked at project completion may be non-functional within two years — while the language community it serves continues to need it.

**Why Balance Is Needed:**

The need for human accessibility (a format people will actually use) pulls toward rich applications. The need for long-term availability pulls toward low-dependency formats. RO-Crate with a static HTML preview resolves this by delivering a human-accessible presentation layer (browsable in any web browser) from a format that requires no ongoing server infrastructure.

---

## Solution

### Core Idea

Place a `ro-crate-metadata.json` file — a JSON-LD document conforming to the RO-Crate specification — in the same directory as the research data files. Optionally (and strongly recommended) also generate an `ro-crate-preview.html` file that renders the metadata as a human-readable page, potentially with embedded content previews (first rows of a spreadsheet, an audio player for sound files). The package can then be served as a static website, deposited in a repository, or archived without any ongoing server infrastructure.

### Key Principles

1. **JSON-LD as the metadata layer.** `ro-crate-metadata.json` uses JSON-LD with schema.org as the base vocabulary. Entities (files, datasets, people, organisations) are described using schema.org properties, with domain-specific vocabulary extensions where required.
2. **HTML preview as the accessibility layer.** The HTML file can be generated automatically from the JSON-LD and provides human-readable access to the collection without tooling or infrastructure. It can include rendered content — audio players, image previews, spreadsheet rows — not just file listings.
3. **Extend schema.org for domain needs.** Where general vocabulary is insufficient, domain communities maintain separate vocabulary documents with persistent identifiers (e.g., W3ID). The extension vocabulary is referenced from within the crate, keeping extensions discoverable and independently resolvable.
4. **Profiles and validation.** A profile defines required and optional properties per entity type for a given domain or project. Validation checks candidate crates against their declared profile. This enables domain communities to express and enforce metadata requirements while remaining within the RO-Crate ecosystem.

### Solution Structure

```
Research Data Directory (RO-Crate)
├── ro-crate-metadata.json   ← JSON-LD; entities + relationships
├── ro-crate-preview.html    ← auto-generated human-readable view
├── data/
│   ├── recording-001.wav
│   ├── image-001.jpg
│   └── dictionary-entries.csv
└── (optional: declared profile for validation)

ro-crate-metadata.json structure:
{
  "@context": "https://w3id.org/ro/crate/1.1/context",
  "@graph": [
    { "@type": "CreativeWork", "@id": "ro-crate-metadata.json", ... },
    { "@type": "Dataset", "@id": "./", "name": "...", ... },
    { "@type": "File", "@id": "data/recording-001.wav", ... },
    ...
  ]
}

Publication pathway (no server required):
  RO-Crate directory → GitHub Pages → static website
  RO-Crate directory → archival repository → persistent access
```

### How the Issues Are Balanced

- **Machine-Readability vs. Human Accessibility** is balanced by: the HTML preview delivers human-accessible presentation generated automatically from the machine-readable JSON-LD — both produced from a single authoritative metadata source
- **General Vocabulary vs. Domain Specificity** is balanced by: schema.org provides the base; domain vocabulary extensions (W3ID-identified) add domain-specific terms while remaining within the linked-data ecosystem and keeping extensions persistently resolvable
- **Archival Longevity vs. Technology Dependencies** is balanced by: the package is a directory of static files — JSON and HTML — requiring no running server, no maintained application, and no proprietary format; it will remain interpretable as long as web browsers exist

### Values and Considerations

**When authoring metadata:**
- ✓ Consider: using RO-Crate tooling (Python `rocrate` library, JavaScript `ro-crate-js`) rather than hand-authoring JSON-LD; context handling errors are a common source of invalid crates
- ✓ Consider: which entity types need domain vocabulary extensions before starting — identify gaps in schema.org coverage for your domain early
- ✓ Weigh: completeness of metadata at authoring time vs. cost of retrospective annotation; automated extraction from file headers and project records reduces the burden

**When generating the HTML preview:**
- ✓ Ensure: the preview is generated from the metadata, not maintained separately — manual maintenance of both files leads to divergence
- ✓ Balance: richness of the embedded content preview (useful for evaluation) vs. file size and generation complexity for large collections

---

## Implementation Examples

### Example 1: LDaCA Arandic Dictionary

**Context:** Language Data Commons of Australia; a community language dictionary combining images, audio recordings of speakers, and textual dictionary entries for an Arandic language.

**How They Balanced the Issues:** A single RO-Crate was generated for the dictionary, with an HTML preview produced automatically from the crate metadata. The preview includes an audio player and image display. The entire collection is published as a static website on GitHub Pages — no server infrastructure required.

**What Worked Well:** Long-lived, low-overhead publication. The static site has no maintenance dependency after deployment, in direct contrast to app-based alternatives that had failed within years of project end.

**Link to Details:** https://www.ldaca.edu.au/

### Example 2: PARADISEC — Archival Scale

**Context:** Pacific and Regional Archive for Digital Sources in Endangered Cultures; tens of thousands of endangered language recordings and cultural materials.

**How They Balanced the Issues:** PARADISEC delivers RO-Crates at scale from a server with object storage backend. File/directory crates are used for backup. The same RO-Crate structure works from individual crates to repository scale — the pattern is scale-agnostic.

**What Worked Well:** RO-Crate's flexibility across scales means PARADISEC can use it both as the internal packaging format and as the interchange format for data delivery.

**Link to Details:** https://www.paradisec.org.au/

### Example 3: LDaCA — Domain Vocabulary Extension

**Context:** Language Data Commons of Australia; multiple language collections across language groups and institutions, all requiring domain-specific metadata terms beyond what schema.org provides.

**How They Balanced the Issues:** LDaCA maintains a vocabulary extension for language data — terms such as dialogue, drama, formulaic, gesture, handwritten — identified via a W3ID persistent identifier. This vocabulary is embedded in RO-Crates for all language collections, providing domain-specific metadata while remaining within the JSON-LD ecosystem.

**What Worked Well:** Domain vocabulary extension allows richly typed metadata for language collections that schema.org alone cannot express, while the persistent identifier for the vocabulary ensures extensions remain resolvable over time.

**Link to Details:** https://www.ldaca.edu.au/

---

## Context-Specific Guidance

### For HASS Research

- RO-Crate is particularly well-suited to HASS domains with long-lived collections: linguistics, musicology, anthropology, digital humanities, and cultural heritage
- The HTML preview is especially valuable in HASS contexts where collections will be accessed by community members, archivists, and researchers without specialist tooling
- FAIR alignment: RO-Crate directly supports Findable (metadata present), Accessible (metadata travels with data), Interoperable (schema.org + domain vocab), Reusable (full contextual description)
- Adoption signal: more than half of ARDC-funded projects at time of source were using RO-Crate as interchange or storage mechanism

### For Indigenous Research

**CARE Principles Application** (Carroll et al., 2020):
- **Collective Benefit:** RO-Crate metadata can embed community-approved descriptions and rights statements, ensuring that how data is described reflects community values rather than institutional defaults
- **Authority to Control:** The vocabulary extension mechanism allows communities to define their own metadata terms and embed them in crates, retaining authority over how data is described; co-located metadata (via RO-Crate) can include access tier annotations
- **Responsibility:** Custodians applying this pattern bear responsibility for ensuring the `ro-crate-metadata.json` accurately reflects community-approved descriptions, access conditions, and cultural sensitivity markers
- **Ethics:** Ensure that the HTML preview and metadata file do not inadvertently expose restricted content; where data carries access restrictions, the metadata file describing it should carry the same restrictions at the storage layer

**Cultural Considerations:**
- Domain vocabulary extensions are the mechanism for embedding community-specific terminology and classification systems rather than mapping all concepts to general schema.org or library vocabulary
- The RO-Crate profile mechanism enables community-defined metadata requirements — useful for formalising what metadata a culturally appropriate crate for a given collection type must contain

### For Different Scales

**Small Projects / Solo Researchers:**
- A minimal RO-Crate with a few entity descriptions and no domain extensions is valid and provides immediate portability benefit
- Tooling (Python `rocrate` library, RO-Crate editor) generates valid JSON-LD without requiring deep linked-data expertise

**Large Collaborative Projects:**
- Define and document domain vocabulary extensions and a project profile early; apply validation against the profile as part of data ingest
- At PARADISEC scale, RO-Crates are generated programmatically from project databases — hand-authoring is not feasible at this scale

---

## Consequences

### What You Gain

- ✅ **Self-describing collections:** each RO-Crate carries its own description — interpretable without querying an external system
- ✅ **Static publication pathway:** the HTML preview enables collections to be published as static websites with no server infrastructure
- ✅ **Ecosystem adoption:** RO-Crate is the de facto standard for FAIR research data packaging in Australia and increasingly in European biosciences; tooling, validators, and repository integrations exist
- ✅ **Scale flexibility:** the same format works from a single dictionary crate to tens of thousands of archive crates
- ✅ **Domain extensibility:** the vocabulary extension mechanism allows domain-specific metadata without abandoning the common standard
- ✅ **Validation support:** the profile mechanism enables communities to define and enforce metadata requirements

### What You Accept

- ⚖️ **JSON-LD complexity:** hand-authoring valid JSON-LD is error-prone; tooling reduces this but adds a dependency on library maintenance
- ⚖️ **Profile/validation immaturity:** at time of source, the profile and validation layer was at proof-of-concept stage; practitioners may need to work with emerging, not stable, tooling in this area
- ⚖️ **Metadata maintenance discipline:** as with all co-located metadata, the `ro-crate-metadata.json` must be kept in sync with the data as it evolves

### Risks to Manage

- ⚠️ **Invalid JSON-LD context handling** → use validated tooling (Python `rocrate` library) rather than constructing JSON-LD by hand; run schema validation as part of ingest
- ⚠️ **Extension vocabulary link rot:** if a domain vocabulary extension loses its persistent identifier, the metadata terms become unresolvable → use W3ID or equivalent for vocabulary URIs and confirm the persistent identifier is maintained by the responsible community
- ⚠️ **Stale metadata after data changes** → integrate metadata update into data management workflows; do not treat crate creation as a one-time step

---

## Known Uses

### PARADISEC

- **Institution/Domain:** Pacific and Regional Archive for Digital Sources in Endangered Cultures; linguistics, musicology, anthropology
- **How They Used It:** Tens of thousands of RO-Crates delivered from server with object storage backend; file/directory crates used for backup
- **Link:** https://www.paradisec.org.au/

### Language Data Commons of Australia (LDaCA)

- **Institution/Domain:** National research infrastructure; Australian language research and digital humanities
- **How They Used It:** RO-Crate for data packaging and interchange across multiple language collections; domain vocabulary extensions for language data using W3ID-identified vocabulary
- **Link:** https://www.ldaca.edu.au/

### ARDC-Funded Projects

- **Institution/Domain:** Australian Research Data Commons; broad disciplinary coverage across ARDC-funded infrastructure projects
- **How They Used It:** More than half of recent ARDC-funded projects using RO-Crate as interchange or storage format — reflecting community convergence on the standard
- **Link:** https://ardc.edu.au/

### European Biosciences (FAIR Digital Objects)

- **Institution/Domain:** European research infrastructure; biosciences FAIR data initiatives
- **How They Used It:** RO-Crate used in FAIR digital object workflows, demonstrating that the pattern generalises beyond HASS to any domain requiring portable, self-describing research data packages
- **Link:** https://www.researchobject.org/ro-crate/

---

## Related Patterns

### Works Well With

- **Co-Located Metadata and Data (A-004):** RO-Crate is the leading concrete implementation of this architectural principle. A-004 describes the structural principle — store metadata alongside data — and I-005 is the specific technology that realises it. Applying A-004 architecturally and choosing I-005 as the implementation is the natural pairing for HASS collections.

### Typical Sequence

```
Co-Located Metadata and Data (A-004) → RO-Crate for Research Data Packaging (I-005)
Architectural principle chosen             Concrete technology selected
```

---

## Pitfalls to Avoid

### Anti-Pattern: Hand-Authored JSON-LD

- **What happens:** A team authors `ro-crate-metadata.json` by hand, copying structure from examples but introducing subtle errors in context handling, entity referencing, or property namespacing
- **Why it's problematic:** JSON-LD context errors can produce a file that parses as valid JSON but fails as valid RO-Crate, or that silently drops semantic meaning. Errors may not be caught until the crate is processed by a downstream tool.
- **Instead:** Use an established library (Python `rocrate`, JavaScript `ro-crate-js`) or a metadata editor that generates valid JSON-LD. Reserve hand-authoring for understanding the format, not production crate creation.

### Common Mistake: Maintaining the HTML Preview Separately

- **Warning signs:** The HTML preview file is committed separately from the metadata and gets out of date as metadata evolves
- **Guidance:** Treat `ro-crate-preview.html` as generated output from `ro-crate-metadata.json`. Regenerate it whenever metadata changes. Automate this in your data publishing workflow.

---

## Resources

### Learning Materials

- RO-Crate official specification and tutorials: https://www.researchobject.org/ro-crate/
- Soiland-Reyes, S., Sefton, P. et al. (2022). Packaging research artefacts with RO-Crate. *Data Science*, 5(2), 97–138. https://doi.org/10.3233/DS-210053

### Tools and Platforms

- Python `rocrate` library: RO-Crate creation and manipulation in Python → https://github.com/ResearchObject/ro-crate-py
- `ro-crate-js`: JavaScript library for RO-Crate → https://github.com/language-research-technology/ro-crate-js
- Crate-O: Web-based RO-Crate metadata editor → https://language-research-technology.github.io/crate-o/

### Further Reading

- RO-Crate specification: https://www.researchobject.org/ro-crate/
- Soiland-Reyes, S., Sefton, P. et al. (2022). Packaging research artefacts with RO-Crate. *Data Science*, 5(2), 97–138. https://doi.org/10.3233/DS-210053
- FAIR Principles: Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3, 160018. https://doi.org/10.1038/sdata.2016.18
- CARE Principles: Carroll, S. R. et al. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, 19(1), 43. https://datascience.codata.org/articles/10.5334/dsj-2020-043 (DOI https://doi.org/10.5334/dsj-2020-043 does not resolve correctly due to journal platform migration)

---

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://datascience.codata.org/articles/10.5334/dsj-2020-043 (DOI https://doi.org/10.5334/dsj-2020-043 does not resolve correctly due to journal platform migration)

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.

Soiland-Reyes, S., Sefton, P., Goble, C., Garijo, D., Ó Carragáin, E., Crusoe, M., Ó Searcóid, S., Sloggett, C., & Thieberger, N. (2022). Packaging research artefacts with RO-Crate. *Data Science*, 5(2), 97–138. https://doi.org/10.3233/DS-210053
