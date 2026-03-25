---
title: "Oral Consent Workflows for Non-Literate Communities"
pattern_id: P-004
pattern_type: process
keywords:
  - oral-consent
  - consent
  - Indigenous-data
  - fieldwork
  - BOLD
  - language-documentation
  - mobile-web-apps
  - CARE
  - culturally-appropriate-methods
hass_domains:
  - linguistics
  - anthropology
  - Indigenous-studies
author: Mat Bettinson
last_updated: 2026-03-25
source_type: interview-transcript
source_ref: "RSE-CEP interview, 2026-03-24"
---

# Oral Consent Workflows for Non-Literate Communities

*A process pattern for integrating recorded oral consent into research tool workflows, replacing written consent forms in contexts where literacy is limited or written documentation carries historical trauma.*

---

## Pattern Metadata

| Field | Value |
|-------|-------|
| **Pattern ID** | P-004 |
| **Pattern Type** | Process |
| **Keywords** | oral-consent, consent, Indigenous-data, fieldwork, BOLD, language-documentation, mobile-web-apps, CARE, culturally-appropriate-methods |
| **Author(s)** | Mat Bettinson |
| **Last Updated** | 2026-03-25 |

---

## Intent

Replace written consent forms with recorded oral consent integrated directly into research tool workflows, enabling ethical research participation in communities where literacy is limited or where written documentation carries historical trauma.

---

## Context

### When This Pattern Applies

- Research involving speakers of minority or Indigenous languages where literacy in the spoken language is limited or non-existent
- Fieldwork in communities with historical experience of repressive bureaucratic documentation, where written forms evoke institutional distrust
- Remote or rural research contexts where participants may be mediated through younger family members with devices, and where device ownership is communal rather than individual
- Research aligned with Basic Oral Language Documentation (BOLD) workflows, where oral modalities are already the primary mode of interaction

### When This Pattern Does NOT Apply

- Research contexts where participants are literate in the language of consent and comfortable with written documentation
- Jurisdictions or ethics frameworks that legally mandate written consent with no provision for oral alternatives — though many ethics boards do accept recorded oral consent when justified
- Large-scale anonymous surveys where individual consent recordings would compromise anonymity

### Prerequisites

- Audio recording capability available to either the researcher or the participant — a mobile phone with a microphone is sufficient
- A lingua franca shared between researcher and participant for the consent exchange
- Ethics board approval for oral consent as an alternative to written consent, with documented justification
- Secure storage for consent recordings with the same data governance as the research data itself

---

## Issues

### Issue 1: Historical Trauma Around Written Documentation

In many Indigenous and minority communities, written forms carry associations with colonial bureaucracy, surveillance, and dispossession. Requesting signatures or written agreement can evoke distrust and damage the researcher-participant relationship before work begins. The consent mechanism itself becomes a barrier to ethical participation.

### Issue 2: Literacy Barriers to Informed Consent

Informed consent requires genuine understanding. When participants cannot read the language of the consent form — or when the spoken language has no widely used writing system — a written form does not achieve informed consent; it merely achieves a mark on paper. The ethical requirement is comprehension and voluntary agreement, not a signature.

### Issue 3: Institutional Ethics Compliance

Research institutions require auditable evidence of informed consent. Ethics boards have established procedures built around written forms, and researchers must demonstrate that alternative approaches meet the same standard of documentation and verifiability. The oral approach must produce records that satisfy institutional requirements, not merely cultural ones.

### Issue 4: Mediated Participation and Device Sharing

In many communities, the person operating the device is not the participant giving consent. Younger family members mediate technology interactions for elders; phones are shared communally rather than owned individually. The consent workflow must account for this indirection — consent is given by the participant, not the device operator.

### Key Constraints

- Consent must be genuinely informed — the participant must understand what they are agreeing to, in a language and modality they are comfortable with
- Consent records must be auditable — the institution must be able to verify that consent was obtained
- Consent must be separable from the research data — if consent is withdrawn, the associated data must be identifiable and removable
- The consent mechanism must not introduce technology barriers beyond those already present in the research interaction

---

## Motivating Example

**The Situation:**
A linguist conducting fieldwork with speakers of Indigenous languages in rural Taiwan had made a series of multi-participant recordings. Some participants had not given consent at the point of recording — a common occurrence in the fluid social dynamics of field sessions where community members join and leave conversations.

**The Issues That Emerged:**
Written consent forms were met with resistance rooted in 50 years of Japanese colonial occupation, during which bureaucratic data collection was a tool of repressive control. At the same time, the linguist needed auditable consent records for their institution. The participants were willing to participate but unwilling to sign documents.

**Why Balance Is Needed:**
The researcher's institutional obligations demanded documented consent, but the culturally appropriate form of agreement was oral. Neither abandoning the research nor forcing written consent was acceptable. The solution had to satisfy both the community's expectations and the institution's requirements simultaneously.

---

## Solution

### Core Idea

Integrate oral consent as a first-class task within the research workflow, recording the researcher's request and the participant's affirmation as audio. Treat the consent recording as a research artefact with the same data management rigour as any other research output — stored securely, linked to the data it authorises, and removable if consent is withdrawn.

### Key Principles

1. **Consent as task, not prerequisite:** Rather than treating consent as a gate that must be passed before any interaction, treat it as a task that can be completed at the appropriate moment — including post-hoc when consent was missed during a fluid field session.

2. **Oral modality as primary, not fallback:** Oral consent is not a degraded version of written consent — it is the culturally and practically appropriate modality for communities where oral communication is the norm. This aligns with BOLD workflow philosophy, which treats oral language work as a legitimate primary modality rather than a substitute for text.

3. **Linked and reversible:** Each consent recording must be linked to the specific data it authorises. If consent is not forthcoming or is later withdrawn, the associated recordings and data can be identified and removed.

4. **Meet participants where they are:** Use communication channels and technology that participants already have access to — social media, SMS, mobile browsers — rather than requiring them to adopt new tools or platforms.

### How the Issues Are Balanced

- **Historical trauma** is addressed by eliminating written forms entirely — the consent interaction uses the same oral modality as the research interaction itself, avoiding the associations that written documentation carries
- **Literacy barriers** are resolved by conducting consent in spoken language that the participant understands, requiring no reading or writing
- **Institutional compliance** is maintained because the audio recording creates an auditable record — the researcher's request and the participant's affirmation are both captured and stored
- **Mediated participation** is accommodated because the oral consent interaction identifies the participant by voice, not by device ownership — the younger family member operates the device, but the elder's voice on the recording is the consent

---

## Implementation Examples

### Example 1: Aikuma-Link — Post-Hoc Consent via Mobile Web App (Taiwan)

**Context:** A linguist working with speakers of Indigenous Formosan languages in rural Taiwan used Aikuma-Link, a server-side job specification system that generates task-encoded URLs. Participants received links via social media or SMS, opening them in a mobile browser with no app installation required.

**How They Applied the Process:**
Consent collection was specified as one of the task types in the job system. When a multi-participant recording had been made without complete consent, the researcher generated a consent task targeting the specific participant. The task was delivered via whatever channel reached that participant — often through a younger family member's social media account. The participant (or their mediator) opened the URL, and the tool guided them through recording their oral consent in Chinese, linked back to the specific recording in question.

**What Worked Well:** The approach integrated consent into the same tool infrastructure used for all other research tasks, avoiding a separate consent-management system. The mobile web app required no installation, reducing friction for participants who were often new to mobile technology.

### Example 2: BOLD-Aligned Fieldwork — Oral Consent in Australian Indigenous Communities

**Context:** The same practitioner extended the oral consent approach to fieldwork in remote Australian Indigenous communities, where device ownership is communal and literacy in spoken languages is limited.

**How They Applied the Process:**
Oral consent was recorded as part of the BOLD-aligned workflow, where all interaction with language material was oral. The consent recording was treated as one component of the documentation session, using the same recording equipment and processes. The communal nature of device ownership meant that consent had to be clearly attributable to the individual participant by voice, independent of who held the device.

**What Worked Well:** The oral modality was consistent with the entire research workflow — participants were not asked to switch to a written modality solely for the consent step. This consistency reduced friction and maintained the trust relationship.

---

## Context-Specific Guidance

### For HASS Research

- Oral consent is most relevant in fieldwork-oriented HASS disciplines — linguistics, anthropology, ethnomusicology, oral history — where researchers interact directly with participants in contexts where written documentation may be inappropriate or impractical
- The approach extends naturally to any HASS research involving participants with low literacy, participants who are minors (with guardian consent), or participants in contexts where written forms create power imbalances
- Document the justification for oral consent in your ethics application with reference to the specific cultural and practical context — ethics boards are more receptive when the rationale is grounded in participant welfare rather than researcher convenience

### For Indigenous Research

**CARE Principles Application** (Carroll et al., 2020):
- **Collective Benefit:** Oral consent enables broader community participation in research by removing literacy barriers, ensuring that research benefits are not restricted to community members who can navigate written forms
- **Authority to Control:** Oral consent recorded in the participant's own voice (or a shared lingua franca) preserves the participant's agency in the consent process. The recording is their statement, in their words, not a form they signed without full comprehension
- **Responsibility:** Researchers using oral consent must maintain consent recordings with the same security and governance as other research data. Consent recordings contain participant-identifying information (voice) and must be protected accordingly
- **Ethics:** The shift to oral consent is itself an ethical act — it acknowledges that the standard institutional consent mechanism may cause harm in some cultural contexts, and adapts the process to prioritise participant comfort and genuine understanding

**Cultural Considerations:**
- In communities with colonial histories involving bureaucratic surveillance, explain why you are recording and what will happen to the recording — the act of recording consent must itself be consensual
- Where device ownership is communal, ensure the consent interaction clearly identifies the consenting individual, not merely the device operator
- Consent may need to be sought in a language other than the language being documented — choose the language in which the participant is most comfortable discussing their rights and the research purpose

### For Different Scales

**Solo Researchers / Small Field Teams:**
- Oral consent can be as simple as turning on a recorder and conducting the consent conversation — no specialised infrastructure is required
- Keep a log linking each consent recording to the data it authorises, even if this is a simple spreadsheet

**Larger Collaborative Projects:**
- Consider integrating consent as a task type in your research tool infrastructure, as demonstrated by Aikuma-Link, so that consent status is tracked programmatically alongside other research data
- Establish clear protocols for who can request consent, in what languages, and how consent recordings are stored and linked to data

---

## Consequences

### What You Gain

- Genuine informed consent from participants who understand what they are agreeing to, in a modality they are comfortable with
- Broader participation — removing literacy barriers means more community members can participate in research, not just those who can navigate written forms
- Stronger trust relationships with communities, particularly those with colonial histories where written documentation is associated with institutional coercion
- An auditable consent record that captures both the request and the affirmation in the participants' own voices

### What You Accept

- Consent recordings are larger and harder to search than signed forms — you cannot quickly scan a folder of audio files the way you can scan a stack of signed documents
- Ethics board approval for oral consent may require additional justification and documentation compared to standard written consent procedures
- Consent recordings contain biometric data (voice) and must be managed with appropriate security — they are more sensitive than a signed form in some data governance frameworks

### Risks to Manage

- If consent recordings are not clearly linked to the data they authorise, withdrawal of consent becomes difficult to action — maintain explicit linkage from the start
- Mediated consent (through a family member operating a device) risks ambiguity about who actually consented — ensure the consenting individual's voice is clearly identifiable in the recording
- Audio recordings may degrade or become inaccessible over time if stored in proprietary formats — use standard open audio formats and include consent recordings in your long-term data preservation plan

---

## Known Uses

### Project 1: Aikuma-Link

- **Institution/Domain:** Language documentation fieldwork, Indigenous Formosan languages (Taiwan)
- **How They Used It:** Oral consent integrated as a task type in a URL-encoded job dispatch system for mobile web apps, enabling post-hoc consent collection via social media and SMS delivery to participants in rural communities

### Project 2: BOLD-Aligned Fieldwork in Remote Australia

- **Institution/Domain:** Language documentation, remote Australian Indigenous communities
- **How They Used It:** Oral consent recording as part of BOLD-aligned research workflows where all interaction with language material was oral, accounting for communal device ownership

---

## Related Patterns

*No published patterns in the current collection have a direct relationship to this pattern. As the collection grows, oral consent workflows are likely to relate to patterns addressing community-delegated access control (where consent determines access tiers) and culturally appropriate consultation processes.*

---

## Common Variations

### Variation 1: Consent as Part of the Research Session

- **When:** Face-to-face fieldwork where the researcher is physically present with the participant
- **Key difference:** Consent is recorded live using the researcher's own equipment as part of the session setup, rather than dispatched as a remote task
- **This is the simpler, more common form** — it requires no infrastructure beyond a recording device

### Variation 2: Remote Post-Hoc Consent via Task Dispatch

- **When:** Consent was missed during a field session, or the researcher needs to obtain consent from a participant who is no longer physically accessible
- **Key difference:** Consent is requested as a remote task delivered via URL, requiring the participant to record their consent independently using a mobile web interface
- **This requires infrastructure** — a job specification system, URL encoding, and a mobile web app — but enables consent collection across distance and time

---

## Pitfalls to Avoid

### Anti-Pattern: Oral Consent as Convenience Shortcut

- **What happens:** A researcher uses oral consent simply because it is faster or easier than preparing written consent forms, without a genuine cultural or literacy justification
- **Why it's problematic:** Ethics boards and reviewers will rightly question oral consent that lacks a principled rationale. Using it as a shortcut undermines the legitimacy of oral consent for researchers who genuinely need it
- **Instead:** Document the specific cultural, historical, or literacy context that makes oral consent the appropriate modality for your participants

### Common Mistake: Failing to Link Consent to Data

- **Warning signs:** Consent recordings stored in a general folder without clear mapping to the specific research data they authorise
- **Guidance:** Maintain explicit, programmatic linkage between each consent recording and the data it covers. When consent is withdrawn, you must be able to identify and remove all associated data

---

## Key References

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, *19*(1), 43. https://doi.org/10.5334/dsj-2020-043

Reiman, D. W., & Bird, S. (2014). Basic Oral Language Documentation. *Language Documentation & Conservation*, *8*, 254–268.
