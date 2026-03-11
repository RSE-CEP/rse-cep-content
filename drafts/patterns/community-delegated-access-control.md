---
title: "Community-Delegated Access Control"
pattern_id: RSE-HASS-002
alternative_names:
  - "Elder-Mediated Access"
  - "Community-Governed Data Access"
keywords:
  - access-control
  - data-sovereignty
  - Indigenous-data
  - community-governance
  - CARE
  - OCAP
  - cultural-protocols
  - Local-Contexts
hass_domains:
  - Indigenous-studies
  - linguistics
  - digital-humanities
version: "0.1.0"
author: mat-bettinson
last_updated: 2026-03-12
source_type: interview-transcript
source_ref: "RSE-CEP practitioner interview on Indigenous language documentation and data sovereignty"
confidence: 0.75
---

## Intent

Enable research data systems to enforce access restrictions that are defined, verified, and governed by the community whose cultural materials are held — rather than by researchers or institutional administrators. [EXTRACTED | source: "practitioner interview" | ref: turns[7,11,41] | "designing systems that are flexible enough to accommodate varying access restrictions based on community-defined governance"]

---

## Context

### When This Pattern Applies

- Research projects holding cultural materials, language recordings, or other data subject to community-determined access protocols [EXTRACTED | source: "practitioner interview" | ref: turns[7] | "some of the recordings were restricted to initiated members as per the community's wishes"]
- Projects involving Indigenous language documentation, cultural heritage archives, or similar collections where the community has governance authority over who may access specific materials [EXTRACTED | source: "practitioner interview" | ref: turns[3] | "web archive and access portal for an Indigenous language corpus, collaborating closely with a community in remote Queensland"]
- Situations where standard "open access" or institution-managed permission models are insufficient because access decisions depend on cultural knowledge held by community members [EXTRACTED | source: "practitioner interview" | ref: turns[11] | "community members express specific wishes about how their data should be accessed or shared"]

### When This Pattern Does NOT Apply

- Projects where access restrictions are purely institutional or regulatory (e.g. ethics-board-imposed embargoes) with no community governance dimension [ELABORATED | basis: "inverse of the pattern's core concern"]
- Collections where the data custodians are comfortable with standard role-based access managed by the research institution [ELABORATED | basis: "distinguishing from simpler access models"]
- Situations where no ongoing relationship with a source community exists or is possible [ELABORATED | basis: "the pattern requires active community participation"]

### Prerequisites

- An established, trust-based relationship with the community whose materials are held [EXTRACTED | source: "practitioner interview" | ref: turns[41] | "actively engaging with communities to understand their values, governance structures, and specific cultural protocols"]
- Identified community authorities (e.g. elders, cultural custodians) who are willing and able to participate in access decisions [EXTRACTED | source: "practitioner interview" | ref: turns[45] | "community elders themselves would oversee the verification process"]
- Agreement on the scope of community authority — which materials and which decisions are delegated [EXTRACTED | source: "practitioner interview" | ref: turns[47] | "tiered access system, where some materials could be made available to a broader audience while preserving stricter controls on more sensitive content"]

---

## Issues

### Issue 1: Open Access Norms vs Community Governance

- Academic culture, funder mandates, and career incentives push toward open access as the default for research outputs [EXTRACTED | source: "practitioner interview" | ref: turns[13] | "Many researchers feel that open access is synonymous with broader visibility and engagement, which can be crucial for their career advancement and meeting funding requirements"]
- Indigenous communities may require restricted access to culturally sensitive materials, governed by cultural protocols that are not legible to external institutions [EXTRACTED | source: "practitioner interview" | ref: turns[11] | "community elders about restricting certain recordings to initiated members only"]
- Bridging this gap requires education and negotiation, not just technical controls [EXTRACTED | source: "practitioner interview" | ref: turns[13] | "helping researchers understand that respecting these boundaries can actually enhance the integrity and relevance of their work"]

### Issue 2: Authority and Verification

- The system must verify who is permitted to access restricted materials, but the knowledge of who qualifies (e.g. initiated status) resides with the community, not the institution [EXTRACTED | source: "practitioner interview" | ref: turns[45] | "community elders themselves would oversee the verification process"]
- Maintaining a static list of authorised users poses privacy risks and removes community agency [EXTRACTED | source: "practitioner interview" | ref: turns[45] | "Rather than maintaining a static list of initiated members, which could pose privacy risks and create accountability issues"]
- The verification process must be workable for community authorities without becoming an unreasonable burden [EXTRACTED | source: "practitioner interview" | ref: turns[47] | "we experienced bottlenecks, especially during peak times when multiple access requests came in simultaneously"]

### Issue 3: Adaptability Across Governance Models

- Different communities have different governance structures — some emphasise collective decision-making, others individual agency over personal contributions [EXTRACTED | source: "practitioner interview" | ref: turns[59] | "the coastal community... preferred a centralized approach... the inland community... valued individual agency and personal connections"]
- A system designed for one governance model may be inappropriate for another [EXTRACTED | source: "practitioner interview" | ref: turns[59] | "decisions about access and usage often focused on the rights of individual data contributors"]
- The access architecture must be flexible enough to accommodate diverse cultural governance without requiring complete rebuilds [EXTRACTED | source: "practitioner interview" | ref: turns[61] | "designed our initial framework with flexibility in mind... modular components for access controls and metadata management"]

### Key Constraints

- Community authorities (elders, custodians) have limited time and should not be overwhelmed by technical processes [EXTRACTED | source: "practitioner interview" | ref: turns[47] | "The elders were already balancing many responsibilities"]
- The system must support transparency and auditability to build and maintain trust [EXTRACTED | source: "practitioner interview" | ref: turns[43] | "logging and tracking features to monitor who accessed what data and when"]
- Long-term sustainability requires that community members can manage the system without ongoing RSE support [EXTRACTED | source: "practitioner interview" | ref: turns[53] | "we prioritize capacity building as an integral part of our project from the outset"]

---

## Motivating Example

**The Situation:**
A research team developed a web archive and access portal for an Indigenous language corpus in partnership with a remote Queensland community. The project leveraged the Language Data Commons of Australia (LDaCA) for data storage but required custom components for access control. [EXTRACTED | source: "practitioner interview" | ref: turns[3,7] | "development of a web archive and access portal for an Indigenous language corpus"]

**The Issues That Emerged:**
In the early stages, the team proceeded with an open-access framework aligned with broader research goals. When they engaged more deeply with community members, they discovered that certain recordings were meant to be restricted to initiated members only — a requirement that had gone unchallenged in initial scoping. [EXTRACTED | source: "practitioner interview" | ref: turns[15] | "there were assumptions about open access that went unchallenged. We proceeded with a more open framework initially"]

**Why Balance Is Needed:**
The team had to backtrack on the infrastructure they had set up, leading to frustration on both sides. The incident demonstrated that access control for culturally governed materials cannot be an afterthought — it must be scoped from the outset with community input, and the resulting architecture must place governance authority with the community rather than the institution. [EXTRACTED | source: "practitioner interview" | ref: turns[15] | "This oversight not only delayed the project but also required us to backtrack on the infrastructure we had set up"]

---

## Solution

### Core Idea

Delegate access decisions to community-designated authorities by building infrastructure that facilitates — rather than replaces — community governance. The system provides the technical scaffolding (authentication, role management, request routing, audit logging) while the community retains the authority to grant, deny, and revoke access to restricted materials. [EXTRACTED | source: "practitioner interview" | ref: turns[41,43,45] | "creating a system that genuinely respects and enforces the community's governance over their data"]

### Key Principles

1. **Authority stays with the community.** The system routes access decisions to community-designated authorities rather than encoding static permission lists. Community elders or custodians approve or deny access requests based on their knowledge of the applicant and community protocols. [EXTRACTED | source: "practitioner interview" | ref: turns[45] | "community elders themselves would oversee the verification process... ensuring that the elders retained control"]

2. **Tiered sensitivity.** Not all materials require the same level of restriction. A tiered access model allows broadly accessible materials to be open while preserving strict community control over the most sensitive content, reducing the burden on community authorities. [EXTRACTED | source: "practitioner interview" | ref: turns[47] | "creating a tiered access system, where some materials could be made available to a broader audience while preserving stricter controls on more sensitive content"]

3. **Transparency through audit.** Comprehensive logging of who accessed what and when provides accountability and builds trust. Community authorities can review access patterns and audit decisions. [EXTRACTED | source: "practitioner interview" | ref: turns[43] | "logging and tracking features to monitor who accessed what data and when. This transparency is crucial for accountability and builds trust"]

4. **Modular architecture.** Access control components should be configurable to accommodate different governance models (collective vs individual, centralised vs decentralised) without requiring major rework. [EXTRACTED | source: "practitioner interview" | ref: turns[61] | "modular components for access controls and metadata management, which could be configured to support either a centralized or decentralized model"]

5. **Cultural metadata integration.** Access restrictions are encoded in the metadata model alongside cultural protocol labels (e.g. Local Contexts labels), making restrictions visible and machine-actionable rather than implicit. [EXTRACTED | source: "practitioner interview" | ref: turns[51] | "incorporated the Local Contexts framework into our metadata model, allowing us to attach specific labels to recordings and documents"]

### Solution Structure

```
┌─────────────────────────────────────────────────┐
│              Research Data Platform              │
│                                                  │
│  ┌──────────┐   ┌──────────────┐   ┌──────────┐ │
│  │ Public    │   │ Restricted   │   │ Highly   │ │
│  │ Materials │   │ Materials    │   │ Sensitive │ │
│  │ (open)    │   │ (request)    │   │ (elder-  │ │
│  │           │   │              │   │ approved)│ │
│  └──────────┘   └──────┬───────┘   └────┬─────┘ │
│                        │                 │       │
│                 ┌──────▼─────────────────▼──┐    │
│                 │   Access Request System    │    │
│                 │  - User submits request    │    │
│                 │  - Routes to community     │    │
│                 │    authority               │    │
│                 │  - Logs all decisions      │    │
│                 └──────────┬────────────────┘    │
│                            │                     │
└────────────────────────────┼─────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │  Community Elders / │
                   │  Cultural Custodians│
                   │  (approve / deny)   │
                   └────────────────────┘
```

### How the Issues Are Balanced

- **Open access vs community governance** is balanced by: tiered access that keeps appropriate materials open while enforcing community-controlled restrictions where cultural protocols require it. Researchers retain access to unrestricted materials; restricted access requires community approval. [EXTRACTED | source: "practitioner interview" | ref: turns[47]]
- **Authority and verification** is balanced by: routing verification to community authorities rather than encoding static permission lists, preserving community agency while providing the technical infrastructure to support it. [EXTRACTED | source: "practitioner interview" | ref: turns[45]]
- **Adaptability across governance models** is balanced by: modular architecture with configurable role and permission structures that can accommodate collective or individual governance without rebuilding the system. [EXTRACTED | source: "practitioner interview" | ref: turns[61]]

### Values and Considerations

**When designing the access request flow:**
- Consider: Community authorities' available time and capacity — design to minimise burden [EXTRACTED | source: "practitioner interview" | ref: turns[47]]
- Consider: Designated review timeframes rather than ad-hoc requests to help authorities manage workload [EXTRACTED | source: "practitioner interview" | ref: turns[47] | "establish designated timeframes for reviewing requests"]
- Consider: Notification systems that alert authorities to new requests without creating pressure [EXTRACTED | source: "practitioner interview" | ref: turns[47]]

**When implementing the metadata model:**
- Ensure: Cultural protocol labels (e.g. Local Contexts) are integrated into the metadata schema, not bolted on as an afterthought [EXTRACTED | source: "practitioner interview" | ref: turns[51]]
- Ensure: Labels communicate access restrictions clearly to both system logic and human users [EXTRACTED | source: "practitioner interview" | ref: turns[51]]
- Balance: Collective cultural protocols vs individual contributor rights, depending on community governance model [EXTRACTED | source: "practitioner interview" | ref: turns[59]]

**When planning for sustainability:**
- Ensure: Community members can administer the system (edit metadata, manage permissions, review audit logs) without ongoing RSE support [EXTRACTED | source: "practitioner interview" | ref: turns[51] | "admin functionalities within the system that enable designated community members to edit metadata, manage access permissions, and track usage"]
- Consider: Training and capacity building as integral project deliverables, not add-ons [EXTRACTED | source: "practitioner interview" | ref: turns[53]]

---

## Implementation Examples

### Example 1: Indigenous Language Corpus Portal

**Context:** A web archive and access portal for an Indigenous language corpus, developed in partnership with a remote Queensland community. Built on the Language Data Commons of Australia (LDaCA) with custom access control components. [EXTRACTED | source: "practitioner interview" | ref: turns[3,7]]

**How They Balanced the Issues:**
The team implemented role-based access control with community-elder-mediated verification. Rather than maintaining a static list of initiated members, access requests were routed to designated community elders who could approve or deny based on their knowledge of the applicant. A tiered access system was introduced to reduce elder workload — broadly accessible materials remained open while strict controls were maintained on sensitive recordings. Local Contexts labels were integrated into the metadata model, and admin functionalities were built to allow community members to directly manage permissions, metadata, and audit logs. [EXTRACTED | source: "practitioner interview" | ref: turns[43,45,47,51]]

**What Worked Well:** The elder-mediated approach preserved community agency and built trust. After iterating on the process (adding designated review timeframes and notification systems), bottlenecks were manageable. The modular architecture allowed later adaptation to a different community with a different governance model (individual rather than collective). [EXTRACTED | source: "practitioner interview" | ref: turns[47,59,61]]

---

## Context-Specific Guidance

### For HASS Research

- Engage with community governance structures before technical design begins — access control requirements should shape architecture, not be retrofitted [EXTRACTED | source: "practitioner interview" | ref: turns[15] | "a clear lesson in the importance of thorough stakeholder engagement"]
- Build community engagement time into project budgets and timelines from the outset; articulate the value in terms of preventing costly rework [EXTRACTED | source: "practitioner interview" | ref: turns[31] | "investing time in these discussions upfront can prevent costly rework later"]
- Document access control decisions and community governance preferences during scoping conversations to create a transparent record [EXTRACTED | source: "practitioner interview" | ref: turns[17] | "document insights and decisions made during these conversations"]

### For Indigenous Research

**CARE Principles Application** (Carroll et al., 2020):
- **Collective Benefit:** Community-delegated access ensures that culturally sensitive materials are shared in ways that benefit the community, not just researchers [EXTRACTED | source: "practitioner interview" | ref: turns[49] | "ensuring that their perspectives shaped the direction of the project"]
- **Authority to Control:** The core of this pattern — community authorities retain decision-making power over who accesses restricted materials [EXTRACTED | source: "practitioner interview" | ref: turns[45]]
- **Responsibility:** Researchers and RSEs bear responsibility for building systems that genuinely enforce community decisions, not just nominally acknowledge them [EXTRACTED | source: "practitioner interview" | ref: turns[41] | "creating systems that empower communities to govern their own data"]
- **Ethics:** Ongoing informed consent and transparent data use agreements articulate the terms under which data can be used [EXTRACTED | source: "practitioner interview" | ref: turns[49] | "data use agreements that articulate the terms under which data can be used"]

**OCAP Principles Application:**
- **Ownership:** Data use agreements establish community ownership; the community retains the right to decide how data is shared and used [EXTRACTED | source: "practitioner interview" | ref: turns[51] | "clear terms of ownership in our data use agreements"]
- **Control:** Admin functionalities enable community members to directly manage metadata, access permissions, and audit logs [EXTRACTED | source: "practitioner interview" | ref: turns[51]]
- **Access:** Tiered access model ensures the community determines who sees what [EXTRACTED | source: "practitioner interview" | ref: turns[47]]
- **Possession:** Where possible, data infrastructure should be transferable to community management [EXTRACTED | source: "practitioner interview" | ref: turns[53]]

**Cultural Considerations:**
- Governance models vary between communities — some prefer collective decision-making, others emphasise individual agency over personal contributions. Engage with each community's specific structures rather than assuming a single model [EXTRACTED | source: "practitioner interview" | ref: turns[59]]
- Local Contexts labels should be selected collaboratively with community representatives to reflect their specific cultural protocols [EXTRACTED | source: "practitioner interview" | ref: turns[51]]

### For Different Scales

**Small Projects / Solo Researchers:**
- Even a simple request-and-approval workflow (e.g. email-based) can implement the core principle of community-delegated authority; the pattern does not require complex infrastructure [ELABORATED | basis: "scaling down the documented approach"]

**Large Collaborative Projects:**
- Designate multiple community authorities to distribute the approval workload [EXTRACTED | source: "practitioner interview" | ref: turns[47]]
- Consider automated handling for lower-sensitivity tiers with community oversight reserved for the most restricted materials [EXTRACTED | source: "practitioner interview" | ref: turns[47]]

---

## Consequences

### What You Gain

- Community trust and genuine partnership through demonstrated respect for governance authority [EXTRACTED | source: "practitioner interview" | ref: turns[45] | "This transparency helped foster trust between our team and the community"]
- Ethical alignment with CARE, OCAP, and Indigenous data sovereignty principles [EXTRACTED | source: "practitioner interview" | ref: turns[49,51]]
- Audit trail providing accountability and transparency about data access [EXTRACTED | source: "practitioner interview" | ref: turns[43]]
- Modular architecture that can adapt to different community governance models [EXTRACTED | source: "practitioner interview" | ref: turns[61]]

### What You Accept

- Increased development time and complexity compared to standard role-based access [EXTRACTED | source: "practitioner interview" | ref: turns[7] | "we needed to balance the use of off-the-shelf solutions with tailored development"]
- Ongoing community engagement and relationship maintenance beyond project funding cycles [EXTRACTED | source: "practitioner interview" | ref: turns[55] | "once project funding ends, it can be difficult to allocate time and resources towards ongoing support"]
- Potential access delays while community authorities review requests [EXTRACTED | source: "practitioner interview" | ref: turns[47]]

### Risks to Manage

- Elder/custodian overload — mitigate with tiered access, designated review windows, and notification systems [EXTRACTED | source: "practitioner interview" | ref: turns[47]]
- System abandonment post-funding — mitigate with capacity building, accessible documentation, and community admin training [EXTRACTED | source: "practitioner interview" | ref: turns[53,55]]
- Assumption of a single governance model — mitigate with modular architecture and early engagement to understand each community's specific structures [EXTRACTED | source: "practitioner interview" | ref: turns[59,61]]
- Privacy risks from user lists — mitigate by keeping verification authority with the community rather than maintaining centralised lists of authorised individuals [EXTRACTED | source: "practitioner interview" | ref: turns[45]]

---

## Known Uses

### Project 1: Language Data Commons of Australia (LDaCA)

- **Institution/Domain:** Australian Research Data Commons / Linguistics
- **How They Used It:** Provides data storage and access infrastructure for language collections, including access control mechanisms for sensitive materials
- **Link:** https://www.ldaca.edu.au/
[ELABORATED | basis: "mentioned as foundational platform in the interview (turns[7]), public project"]

### Project 2: Local Contexts

- **Institution/Domain:** Local Contexts initiative / Indigenous data governance
- **How They Used It:** Provides Traditional Knowledge and Biocultural labels and notices that communicate community-defined access and use conditions for cultural heritage materials
- **Link:** https://localcontexts.org/
[ELABORATED | basis: "mentioned as implemented framework in the interview (turns[51]), public initiative"]

---

## Related Patterns

### Works Well With

- **Version Control for Research (RSE-HASS-001):** Repository access controls complement community-delegated access by providing a technical layer for managing who can modify (not just view) research materials
- **Ethical Scoping Conversations:** Community-centered scoping practices (discussed by the same practitioner) ensure access requirements are identified before technical design begins [EXTRACTED | source: "practitioner interview" | ref: turns[15,27]]

### Alternative Approaches

- **Institution-Managed Access Control:** When access restrictions are determined by ethics boards or institutional policy rather than community governance, a simpler institution-managed model may suffice [ELABORATED | basis: "inverse case described in Context section"]

---

## Pitfalls to Avoid

### Anti-Pattern: Retrofit Access Control

- **What happens:** The team builds an open-access system and later tries to bolt on community-governed restrictions
- **Why it's problematic:** Requires costly rework, damages community trust, and may leave traces of previously-open data in caches or archives
- **Instead:** Engage with community governance requirements during initial scoping and design the access architecture around them from the start
[EXTRACTED | source: "practitioner interview" | ref: turns[15] | "we proceeded with a more open framework initially... This oversight not only delayed the project but also required us to backtrack"]

### Common Mistake: Assuming One Governance Model Fits All

- **Warning signs:** Designing for collective-only or individual-only governance without asking the community
- **Guidance:** Build modular access control components that can be configured for different governance structures; always engage each community to understand their specific decision-making traditions
[EXTRACTED | source: "practitioner interview" | ref: turns[59,61]]

### Common Mistake: Static Permission Lists

- **Warning signs:** Maintaining a centralised database of authorised community members managed by the research team
- **Guidance:** Keep verification authority with the community — route access requests to community-designated authorities rather than encoding static lists that create privacy risks and remove community agency
[EXTRACTED | source: "practitioner interview" | ref: turns[45]]

---

## Resources

### Tools and Platforms

- Local Contexts: TK and BC labels for communicating Indigenous data governance protocols → https://localcontexts.org/
- Language Data Commons of Australia (LDaCA): Research data infrastructure for language collections → https://www.ldaca.edu.au/
[ELABORATED | basis: "tools mentioned in the interview"]

### Further Reading

- Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., et al. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://doi.org/10.5334/dsj-2020-043
- First Nations Information Governance Centre. The First Nations Principles of OCAP®. https://fnigc.ca/ocap-training/
- Local Contexts. Traditional Knowledge Labels. https://localcontexts.org/labels/traditional-knowledge-labels/
[ELABORATED | basis: "frameworks discussed extensively in the interview"]

---

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://doi.org/10.5334/dsj-2020-043
