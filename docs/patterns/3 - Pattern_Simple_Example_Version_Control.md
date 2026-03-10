# Version Control for Research Data

*Managing evolving research datasets while maintaining reproducibility and traceability*

**Alternative Names:** Data Versioning, Dataset Version Management, Research Data Lineage

---

## Pattern Metadata

| Field | Value |
|-------|-------|
| **Pattern ID** | RSE-HASS-001 |
| **Keywords** | version-control, research-data, reproducibility, FAIR, data-management, collaboration |
| **Maturity Level** | Recommended (Validated) |
| **Author(s)** | CDL RSE Team, ARDC |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-02-10 |

---

## Intent

Establish a systematic approach to tracking changes in research datasets over time, enabling researchers to maintain reproducibility, understand data evolution, and collaborate effectively while balancing storage constraints with the need for comprehensive history.

---

## Context

### When This Pattern Applies

This pattern is relevant when:
- Research datasets change over time through cleaning, enrichment, or correction
- Multiple researchers collaborate on the same dataset
- Reproducibility of analysis results is important
- Dataset provenance and lineage must be documented
- Working with textual data, structured data (CSV, JSON), or small-to-medium binary files
- Projects span months or years with evolving understanding of the data

### When This Pattern Does NOT Apply

This pattern should not be used when:
- Datasets are truly static and will never change
- Files are extremely large (>100GB per file) and change entirely with each version
- Real-time streaming data is the primary concern
- Data sensitivity requires offline-only access with no version history

### Prerequisites

- Basic understanding of file systems and data organization
- Agreement on dataset scope and boundaries
- Storage infrastructure for version history
- Team agreement on versioning approach

---

## Issues

*The competing concerns this pattern helps balance.*

### Issue 1: Reproducibility vs. Storage Efficiency

- **Description:** Research requires reproducing analyses with exact dataset versions, but storing every version consumes significant storage space
- **Why it matters:** Scientific integrity demands reproducibility, but researchers often have limited storage budgets
- **Who is affected:** Individual researchers, research groups, institutional repositories

### Issue 2: Collaboration vs. Data Consistency

- **Description:** Multiple researchers need to work with data simultaneously, but uncoordinated changes can create conflicts and confusion
- **Why it matters:** Collaborative research is increasingly common in HASS, but data inconsistencies undermine research quality
- **Who is affected:** Research teams, co-authors, research assistants

### Issue 3: Detailed History vs. Practical Usability

- **Description:** Complete change history aids understanding but can overwhelm users with complexity
- **Why it matters:** Researchers need to understand what changed without drowning in minutiae
- **Who is affected:** New team members, future researchers reusing data, peer reviewers

### Key Constraints

- Storage costs and institutional limits
- Technical capabilities of team members
- Need for long-term preservation (beyond project lifetime)
- Data sensitivity and access control requirements
- Compliance with FAIR principles (Chue Hong et al., 2022)

---

## Motivating Example

**The Situation:**

A digital humanities research team is building a corpus of historical newspaper articles about Indigenous communities in Australia from 1900-1950. The team has five researchers across three universities working over 18 months.

**The Issues That Emerged:**

Initially, researchers kept datasets in shared folders named by date (e.g., "corpus_jan2024.csv"). Within weeks, confusion arose:
- One researcher corrected OCR errors but others kept using the old file
- Two researchers independently enriched metadata, creating divergent versions
- A journal required the dataset used for a published analysis, but no one could confidently identify which version it was
- After six months, no one could trace why certain articles were excluded

The team needed reproducible analysis while continuing to improve the data. They also needed to respect Indigenous community feedback that came in stages, requiring data updates without losing the ability to reference earlier versions.

**Why Balance Is Needed:**

Simply keeping all versions would consume terabytes of storage. Having no version history would make research irreproducible and unethical when community feedback required changes. The team needed structured evolution with clear provenance.

---

## Solution

### Core Idea

Treat research data similarly to how software engineers treat code: use systematic versioning that tracks what changed, who changed it, when, and why. Combine structured metadata about versions with selective storage of full versions at meaningful milestones, while using change descriptions to bridge between milestones.

### Key Principles

1. **Semantic Versioning for Data:** Use meaningful version numbers (e.g., 1.0, 1.1, 2.0) where major versions indicate breaking changes, minor versions indicate additions, and patches indicate corrections
2. **Explicit Change Documentation:** Every version includes human-readable documentation of what changed and why
3. **Milestone-Based Full Snapshots:** Store complete datasets at significant milestones (publications, major analyses) while using incremental descriptions between milestones
4. **Provenance as First-Class Metadata:** Track not just what changed but also who made changes, when, and with what authority (especially important for Indigenous data)

### Solution Structure

```
Research Data Version System
│
├── Dataset Repository
│   ├── Current Version (working copy)
│   ├── Version History
│   │   ├── v1.0 (initial collection)
│   │   ├── v1.1 (metadata enriched)
│   │   ├── v2.0 (community feedback incorporated)
│   │   └── v2.1 (OCR corrections)
│   └── Change Logs
│       ├── v1.0-to-v1.1.md
│       ├── v1.1-to-v2.0.md
│       └── v2.0-to-v2.1.md
│
├── Provenance Metadata
│   ├── Creator information
│   ├── Change authority (e.g., community approval)
│   ├── Timestamps
│   └── Dependencies
│
└── Access Control
    ├── Version-specific permissions
    └── Usage tracking
```

### How the Issues Are Balanced

- **Issue 1 (Reproducibility vs. Storage)** is balanced by: Storing full snapshots only at milestones while maintaining detailed change logs between them. Researchers can reconstruct any version but don't pay storage costs for every incremental change.

- **Issue 2 (Collaboration vs. Consistency)** is balanced by: Establishing a clear "main" version with structured processes for proposing and integrating changes. Team members work from known versions and explicitly merge improvements.

- **Issue 3 (History vs. Usability)** is balanced by: Using semantic versioning to signal significance of changes, supported by human-readable changelogs. Users can quickly identify which versions matter for their purposes.

### Values and Considerations

**When choosing version storage approach:**
- ✓ Consider: Dataset size and rate of change (affects storage strategy)
- ✓ Consider: Team size and geographic distribution (affects collaboration needs)
- ✓ Consider: Preservation timeline (10 years? 50 years?)
- ✓ Weigh: Accessibility vs. protection (especially for culturally sensitive material)

**When implementing version tracking:**
- ✓ Ensure: Every version has unique identifier
- ✓ Ensure: Changes are documented in plain language, not just technical diffs
- ✓ Balance: Automation (reducing burden) with human oversight (maintaining quality)

---

## Implementation Examples

### Example 1: Language Documentation Project

**Context:** 
Linguists working with an Aboriginal community to document an endangered language, creating a corpus of transcribed recordings with cultural annotations. Team of 3 linguists + 5 community elders. 5-year project.

**How They Balanced the Issues:**

The team used Git with Git LFS (Large File Storage) for audio files, storing transcription data as plain text CSV files. They established:
- Version tags for each community review cycle (v1.0-community-review-1)
- Branch-based workflow: main branch only updated after community approval
- Change logs written in both English and language community's preferred language
- Quarterly "release" versions stored in institutional repository with DOIs

**Key Decisions:**
- Used Git because team had existing skills; trained community members in basic operations
- Stored audio as LFS to manage large files while keeping text version-controlled normally
- Made community approval explicit in version tags, respecting Indigenous data sovereignty

**What Worked Well:** 
Clear versions for publications, explicit community authority in version history, minimal storage costs.

**Link to Details:** (example URL)

### Example 2: Historical Census Analysis

**Context:** 
Social historian analyzing 19th-century census data, working solo but publishing datasets for reuse. Dataset: 50,000 records, multiple tables, 2-year project.

**How They Balanced the Issues:**

Researcher used Zenodo versioning with yearly snapshots, combined with local Git repository for day-to-day work. Approach:
- Git locally for detailed history during active work
- Zenodo deposit for each publication milestone (v1.0, v2.0)
- README.md files explaining changes between major versions
- Supplementary "errata" documents for post-publication corrections

**Key Decisions:**
- Zenodo for persistence and DOI minting (FAIR principle compliance)
- Git locally for granular control without exposing work-in-progress
- Major versions only when publishing, keeping threshold high enough to be meaningful

**What Worked Well:** 
Published datasets were citeable, corrections were traceable, peer reviewers could access exact data versions.

**Link to Details:** https://zenodo.org/record/example (example URL)

### Additional Examples

- Digital archaeology project using DVC (Data Version Control): https://dvc.org/doc/use-cases

---

## Context-Specific Guidance

### For HASS Research

- Prioritize human-readable changelogs over technical diffs (HASS researchers may not read code-style diffs)
- Version cultural interpretations and annotations alongside raw data
- Consider disciplinary norms (historians may need longer preservation than media studies)
- Document subjective decisions (coding schemes, inclusion criteria) in version notes

### For Indigenous Research

**CARE Principles Application** (Carroll et al., 2020):

- **Collective Benefit:** Version history should document how community feedback shaped data evolution, demonstrating responsive partnership
- **Authority to Control:** Community members should have authority to approve major versions; version tags can explicitly mark community approval
- **Responsibility:** Version metadata must record consultation processes and consent status at each version
- **Ethics:** Versions containing culturally sensitive material should have appropriate access controls that can differ between versions

**Cultural Considerations:**
- Some communities may request retrospective removal of data; version system must support this while maintaining research integrity
- Version notes should record cultural protocols observed
- Consider who has authority to create new versions (researcher-only vs. community co-versioning)

### For Different Scales

**Small Projects / Solo Researchers:**
- Simple folder-based versioning with clear naming may suffice (corpus_v1.0_2024-01-15)
- Focus on major milestones rather than every change
- Zenodo for publishing final and interim versions

**Large Collaborative Projects:**
- Git-based workflows with protected main branches
- Automated testing to verify data quality before version acceptance
- Dedicated data manager role to oversee versioning

---

## Consequences

### What You Gain

- ✅ **Reproducibility:** Can recreate exact analysis conditions months or years later
- ✅ **Transparency:** Clear record of how data evolved and why
- ✅ **Collaboration:** Team members work from synchronized versions with clear integration processes
- ✅ **FAIR Compliance:** Versions are findable, accessible, and reusable with proper metadata
- ✅ **Error Recovery:** Can revert problematic changes if issues are discovered

### What You Accept

- ⚖️ **Initial Learning Curve:** Team must learn versioning concepts and tools (though simpler than it appears)
- ⚖️ **Overhead:** Creating good version documentation takes time (but saves more time later)
- ⚖️ **Storage Costs:** Some storage increase for version history (mitigated by selective full snapshots)

### Risks to Manage

- ⚠️ **Version Proliferation** → Mitigation: Establish clear criteria for creating new versions (not every tiny edit)
- ⚠️ **Inconsistent Practices** → Mitigation: Create team guidelines and templates for version documentation
- ⚠️ **Lost Context** → Mitigation: Require meaningful commit messages and changelog entries
- ⚠️ **Access Control Errors** → Mitigation: Regularly audit who can create versions, especially for sensitive data

---

## Known Uses


### Project 1: Australian Data Archive

- **Institution/Domain:** Australian Data Archive / Social Science Data
- **How They Used It:** DOI-versioned datasets with supplement files documenting changes between versions
- **Link:** https://dataverse.ada.edu.au/


---

## Related Patterns

### Works Well With

- **Research Data Packaging (RO-Crate):** Version history becomes part of research object metadata → [See RSE-HASS-005]
- **Data Quality Assurance:** Versioning enables tracking quality improvements over time → [See RSE-HASS-012]
- **Collaborative Workflows:** Version control forms foundation for team data work → [See RSE-HASS-018]

### Alternative Approaches

- **Immutable Datasets with Derivatives:** Instead of versioning one dataset, treat each change as a new derived dataset → [See RSE-HASS-002]
  - Choose version control when: Dataset identity persists despite changes
  - Choose derivatives when: Each version is fundamentally different dataset

### Typical Sequence

```
Data Collection Planning → [Version Control for Research Data] → Collaborative Workflows → Publication & Preservation
```

---

## Common Variations

### Variation 1: Blockchain-Based Versioning

- **When:** Maximum auditability required, especially for contested or legally sensitive data
- **Key difference:** Uses distributed ledger for tamper-proof version history
- **Link:** 

### Variation 2: Database-Native Versioning

- **When:** Data in relational database rather than files
- **Key difference:** Uses database temporal features (e.g., PostgreSQL temporal tables)
- **Link:** 

---

## Pitfalls to Avoid

### Anti-Pattern: Date-in-Filename Versioning Without Documentation

- **What happens:** Files named "data_2024-01-15.csv", "data_2024-02-03.csv" with no explanation of changes
- **Why it's problematic:** Cannot determine what changed or why; hard to choose correct version; accumulates redundant files
- **Instead:** Use semantic versions with changelogs explaining what each version represents

### Common Mistake: Version Everything, All the Time

- **Warning signs:** Hundreds of micro-versions; version created for every edit; massive storage consumption
- **Guidance:** Version at meaningful milestones only; use informal work-in-progress copies between versions; balance detail with practicality

---

## Resources

### Learning Materials

- Turing Way: Version Control for Research Data: https://the-turing-way.netlify.app/reproducible-research/vcs/vcs-data.html
- Software Carpentry: Version Control with Git: https://swcarpentry.github.io/git-novice/
- ARDC Data Versioning Guide: https://ardc.edu.au/resources/working-with-data/data-versioning/

### Code Examples

- DVC tutorial repository: https://github.com/iterative/example-get-started
- Git LFS examples: https://github.com/git-lfs/git-lfs/wiki/Tutorial
- Simple version control scripts: https://github.com/cdl-rse/versioning-examples

### Tools and Platforms

*Suggested tools that support this pattern (not prescriptive):*
- **Git + Git LFS:** Version control with large file support → https://git-scm.com, https://git-lfs.github.com
- **DVC (Data Version Control):** Git-like experience specifically for data → https://dvc.org
- **Zenodo:** Versioned dataset hosting with DOIs → https://zenodo.org
- **Dataverse:** Research data repository with versioning → https://dataverse.org
- **Dolt:** Git-like version control for databases → https://www.dolthub.com

### Further Reading

- Perkel, J. M. (2018). A toolkit for data transparency takes shape. *Nature*, 560, 513-515. https://doi.org/10.1038/d41586-018-05990-5
- Stodden, V., & Miguez, S. (2014). Best Practices for Computational Science: Software Infrastructure and Environments for Reproducible and Extensible Research. *Journal of Open Research Software*, 2(1). https://openresearchsoftware.metajnl.com/articles/jors.ay
- FORCE11 Data Citation Principles: https://force11.org/info/data-citation-principles/

---

## Validation Checklist

*How to verify appropriate application:*

**Essential Elements:**
- [ ] Every dataset version has unique identifier
- [ ] Changes between versions are documented
- [ ] Major milestones have full snapshots stored
- [ ] Team knows which version is "current"
- [ ] Published analyses reference specific versions

**For Indigenous Research (if applicable):**
- [ ] Community approval process reflected in version history
- [ ] Version notes document consultation processes
- [ ] Access controls appropriate for sensitivity level
- [ ] Community can request changes or removals

---

## How to Contribute

- **GitHub Issues:** 
- **Discussion Forum:** 
- **Email:** 

**We Welcome:**
- Additional examples from HASS research projects
- Variations for specific data types (geospatial, audiovisual, etc.)
- Tools and approaches we haven't covered

---

## Citation

**APA:**
```
CDL RSE Team. (2026). Version Control for Research Data. CDL Recommended 
Patterns in RSE for HASS & Indigenous Research, RSE-HASS-001. 
https://doi.org/###
```

**BibTeX:**
```bibtex
@techreport{rse-hass-001_2026,
  author = {{CDL RSE Team}},
  title = {Version Control for Research Data},
  institution = {Australian Research Data Commons},
  year = {2026},
  series = {CDL Recommended Patterns in RSE},
  number = {RSE-HASS-001},
  doi = {},
  url = {}
}
```

---

## Metadata

| Field | Value |
|-------|-------|
| **DOI** | |
| **License** | CC BY 4.0 |
| **Repository** | https://github.com/### |
| **Version History** | https://github.com/###/patterns/RSE-HASS-001/CHANGELOG.md |

---

## Acknowledgments

This pattern was developed through consultation with:
- ARDC HASS and Indigenous Research Data Commons community

We acknowledge the Aboriginal and Torres Strait Islander peoples as the Traditional Owners and Custodians of the lands on which this work was developed.

Funded by the Australian Research Data Commons (ARDC), enabled by NCRIS.

---

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://doi.org/10.5334/dsj-2020-043

Chue Hong, N. P., Katz, D. S., Barker, M., Lamprecht, A., Martinez, C., Psomopoulos, F. E., Harrow, J., Castro, L. J., Gruenpeter, M., Martinez, P. A., & Honeyman, T. et al. (2022). FAIR Principles for Research Software version 1.0 (FAIR4RS Principles v1.0). Research Data Alliance. https://doi.org/10.15497/RDA00068

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.

Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, *3*, 160018. https://doi.org/10.1038/sdata.2016.18

---

**Pattern Version 1.0.0**  
**Developed by:** CDL RSE Capacity Enhancement Project  
**License:** CC BY 4.0  
**Pattern Repository:** https://github.com/###

Attribution Statement: AIA PAI Hin R Claude4.5 v1.0
