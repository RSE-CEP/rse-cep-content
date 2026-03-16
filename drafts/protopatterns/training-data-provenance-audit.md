# Training Data Provenance Audit for Community-Sensitive AI

**ID:** P-001
**Type:** Process
**Description:** A systematic pre-adoption audit practice for evaluating pre-trained models' training data for provenance, consent history, and community alignment before deployment in HASS contexts involving sensitive or community-governed data.
**Created:** 2026-03-16
**Last updated:** 2026-03-16

## Projects
- **Colonial correspondence NER pipeline** — pre-trained model proposed for entity extraction; community liaison raised concern that training data may have included digitised mission records created without consent; led to development of the audit practice (Source: Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16)
- **Climate policy sentiment analysis** — pre-trained sentiment model used without adequate provenance review; post-publication a community member identified likely bias from underrepresented marginalised voices in training data; regretted the absence of a structured review process (Source: Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16 | 2026-03-16 | Two concrete misalignment incidents; developed checklist practice; framing of audit as a required step before model adoption |

## Notes
### From: Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16)

**The trigger incident (colonial correspondence project):**
> "I proposed using a pre-trained model for initial entity extraction. I assumed it would accelerate our progress, but I didn't adequately audit the training data provenance of that model. During a community meeting, a liaison raised a critical question regarding whether the model had been trained on digitised mission records akin to the very documents we were working with — records created without consent and reflecting a colonial administrative perspective."

**A second incident (climate policy project):**
> "We were under pressure to produce results quickly, and the absence of clear governance structures led us to rely on a pre-trained model without adequately assessing its training data provenance or suitability for our context. When the results were published, a community member pointed out that the model had been trained on data that likely included content from marginalized voices that weren't represented in our dataset."

**The developed practice — a checklist:**
> "I've developed a checklist that includes community alignment as a critical factor when assessing any tools or models for a project. This checklist serves as a reminder to pause and reflect on the community's values, even when time is limited."

**Key checklist questions (drawn from governance framework discussion):**
- Is the model's training data transparent and documented?
- Was training data collected with appropriate consent?
- Does training data reflect or misrepresent the communities whose data this project touches?
- How does the model align with the community's understanding of their history/context?
- What biases might it carry for underrepresented or non-Western-centric groups?

**Pressure dynamics:**
- Deadline pressure is the primary cause of skipping the audit — "the ease and efficiency of using established tools are hard to resist, especially when project timelines are pressing"
- Both incidents occurred specifically when under project pressure
- The checklist is a lightweight mechanism to create a "pause point" even under pressure

**Connection to epistemological bias:**
The audit connects to a broader concern about models trained on Western-centric, English-language corpora misaligning with Indigenous perspectives and ways of knowing — "significant misalignments with Indigenous perspectives and ways of knowing... can lead to harmful assumptions in the outputs, undermining both the research credibility and the community's trust."

**Relationship to governance framework:**
The audit is a specific component of the broader community governance workflow (P-002), but can be applied independently — an RSE can run a provenance audit before adopting a pre-trained model even without a full OCAP/CARE governance structure in place.
