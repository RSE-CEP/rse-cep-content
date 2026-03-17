# RO-Crate for Research Data Packaging

**ID:** I-005
**Type:** Implementation
**Description:** Use the RO-Crate standard — a JSON-LD metadata file (`ro-crate-metadata.json`) stored alongside research data, with optional HTML preview — to package collections as self-describing, portable, and validatable research objects.
**Created:** 2026-03-17
**Last updated:** 2026-03-17

## Projects
- **PARADISEC** — tens of thousands of RO-Crates delivered from a server; data on object storage, backed up as file/directory crates; demonstrates RO-Crate at archival scale (Source: Peter Sefton YT Talk on RO-Crate)
- **LDaCA Arandic dictionary** — single-crate example: images, audio of speakers, dictionary entries; HTML preview generated automatically; published as a static website on GitHub Pages (Source: Peter Sefton YT Talk on RO-Crate)
- **Language Data Commons of Australia (LDaCA)** — multiple collections using RO-Crate for data packaging and interchange; domain vocabulary extensions for language data (Source: Peter Sefton YT Talk on RO-Crate)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| Peter Sefton YT Talk on RO-Crate | 2026-03-17 | Explained core mechanics (JSON-LD + HTML), demonstrated examples at single-crate and archival scale, described profile/validation layer under development, discussed vocabulary extension for domain-specific metadata |

## Notes
### From: Peter Sefton YT Talk on RO-Crate (2026-03-17)

**What it is:**
> "RO-Crate is a way — well it started as a way of packaging research data by putting a JSON file… you put the JSON file beside the files."

JSON-LD metadata file (`ro-crate-metadata.json`) stored in the same directory as the data. Human-readable name: Research Object Crate.

**HTML preview — a key affordance:**
> "One of the nice features about RO-Crate is that it strongly encourages you to also put an HTML file alongside the JSON file in the directory. So we can — if you bother to make the HTML file and you can do that automatically — then you can actually provide some kind of view of what's inside the file."

Preview can include rendered content (first rows of spreadsheet, audio player, visualisations), not just file listings. This bridges the gap between machine-readable metadata and human usability.

**Static web publication:**
Arandic dictionary example: HTML preview generated automatically from crate metadata; hosted as a completely static website (GitHub Pages). No server infrastructure. Contrasted explicitly with phone apps that "lasted a couple of years before they stopped working altogether." RO-Crate enables long-lived, low-overhead publication.

**Scale:**
PARADISEC runs "tens of thousands of crates" from a server, with object storage backend and file-directory backup. RO-Crate works from a single package up to a large repository.

**Vocabulary extension for domain metadata:**
schema.org covers general properties (contentSize, dateModified, description) but not domain-specific terms. LDaCA maintains a separate vocabulary for language data (dialogue, drama, formulaic, gesture, handwritten, etc.) with a persistent identifier via W3ID. This vocabulary is used inside RO-Crates for language collections. Pattern: use schema.org as the base, extend with domain vocabulary as needed.

**Profiles and validation (in development at time of talk):**
> "The next step is to define how we represent schemas and profiles using RO-Crate compatible methods."

RO-Crate itself can be used to express a profile (eating their own dog food). A profile defines required/optional properties per entity type. Validation can then check a candidate crate against its profile. At talk time: proof-of-concept stage, likely to be accepted into RO-Crate spec.

**Adoption signal:**
> "A lot of the things funded by the ARDC recently… more than half of the projects are using RO-Crate as an inter data interchange or data storage mechanism."
Also widely used in European FAIR digital objects work, especially in biosciences.

**Contrast with fragile alternatives:**
Phone apps for language dictionaries "lasted a couple of years before they stopped working altogether." RO-Crate + static HTML is positioned as the archivally sound alternative.

**HASS-specific fit:**
Particularly well-suited to linguistics, digital humanities, cultural heritage — domains with long-lived collections, community custodianship concerns, and need for human-readable presentation alongside machine-readable metadata. PARADISEC (linguistics, musicology, anthropology, Pacific region) is the canonical exemplar.
