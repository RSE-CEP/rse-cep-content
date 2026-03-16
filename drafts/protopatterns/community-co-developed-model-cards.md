# Community-Co-Developed Model Cards

**ID:** D-001
**Type:** Design
**Description:** Model cards designed and produced collaboratively with community representatives, structured to communicate AI model provenance, limitations, intended use, and ethical considerations in language and format that is meaningful and accessible to non-technical community stakeholders — not just technical audiences.
**Created:** 2026-03-16
**Last updated:** 2026-03-16

## Projects
- **Colonial correspondence NER pipeline** — model cards co-developed with community representatives as part of the governance framework; positioned as a key mechanism for ensuring community sign-off is informed and meaningful (Source: Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16)

## Sources
| Source | Date Mined | Key Contributions |
|--------|-----------|-------------------|
| Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16 | 2026-03-16 | Motivation and context for community-co-developed model cards; role in governance workflow; lightweight applicability; evidence of real-world influence on decisions |

## Notes
### From: Interview: RSE/AI-ML Engineer, Centre for Digital Humanities and Social Analysis, 2026-03-16

**Motivation — standard model cards don't serve community stakeholders:**
> "I've also been advocating for community involvement in the creation of model cards — documentation that describes the model's intended use, limitations, and ethical considerations — so that it can be meaningful and accessible to the community."

The problem: standard model cards (as a technical documentation genre) are written for technical audiences. In HASS/Indigenous contexts, the community stakeholders who need to make governance decisions about model use are not necessarily technical, but they are domain experts in the subject matter and cultural context.

**What the card needs to communicate (from governance checklist discussion):**
- Model's intended use in this research context
- Training data provenance — where it came from, whether consent was obtained
- Limitations relevant to this community's context (e.g. Western-centric training, bias toward dominant languages)
- Potential misrepresentations or harms for this specific community
- Clear mechanism for feedback and accountability
- How the model aligns (or doesn't) with the community's understanding of their history/data

**The co-development process:**
> "We outline clear documentation processes that reflect community values, ensuring that model cards and other artefacts are developed collaboratively."
- Community representatives involved in drafting and reviewing
- Language and framing shaped by community input
- Iterative refinement as community understanding and concerns evolve

**Lightweight applicability — works even without full governance framework:**
> "Creating model cards encourages a reflective practice around the models we deploy, prompting us to consider who the model serves, what biases it may carry, and how it aligns with the research goals."
> "The process of developing a model card can also facilitate conversations with researchers and stakeholders about ethical implications, even if formal governance structures aren't in place."

**Evidence that model cards can influence decisions:**
> "In one project, after presenting the model card to the research team and stakeholders, we recognized through the outlined limitations that the model might not adequately capture the perspectives of certain marginalized communities. This prompted us to reconsider our approach and seek additional data sources to ensure a more representative analysis."

**Risk of checkbox use:**
> "If stakeholders view model cards merely as a checkbox rather than a meaningful tool for ethical reflection, the potential for impact diminishes. The key factor is whether the team is genuinely engaged in the process and open to the insights these tools provide."

**Still a work in progress:**
> "While we've made progress in outlining this governance structure, it's still a work in progress."
No standardised template yet exists for community-accessible model cards in HASS/Indigenous research contexts — identified as a gap in the field.

**Relationship to other patterns:**
- P-002 (Community Governance Workflow for AI Model Release) — the model card is a key artefact within this workflow; co-development is part of the governance process
- P-001 (Training Data Provenance Audit) — provenance findings from the audit feed into the model card's training data documentation
