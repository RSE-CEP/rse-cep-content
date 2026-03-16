# Pattern Definition Guide

## CDL Recommended Patterns in RSE for HASS & Indigenous Research

## What is a Pattern?

### Foundational Definition

A **pattern** describes an issue that occurs repeatedly in our environment, and then describes the core of the solution, in such a way that you can use this solution a million times over, without ever doing it the same way twice.

*Origin: This concept was pioneered by Christopher Alexander in architecture and adapted for software engineering. We've further adapted it for research software engineering to encompass not just problems to solve, but requirements to meet, principles to uphold, and goals to achieve.*

**Note on "Issue" vs. "Problem"**: While traditional pattern literature uses "problem," in research software engineering we often address **requirements** (FAIR, CARE, ethical codes), **principles** (Indigenous data sovereignty, open science), **goals** (reproducibility, sustainability), **challenges** (balancing competing values), **needs** (user requirements), or genuine **technical problems** (performance, bugs). We use "Issue" as an inclusive term that respects the diverse nature of research software engineering work.

### The Three Essential Components 

Every pattern consists of three fundamental parts:

1.  **Context**
    - The situation or environment where the problem exists
    - The circumstances that make the issue relevant
    - The boundaries within which the solution applies
2.  **Issues**
    - The conflicting requirements that must be balanced
    - Competing concerns and constraints
    - Trade-offs that must be considered
    - Example: Wanting data to be openly accessible while protecting Indigenous cultural protocols
3.  **Solution**
    - A configuration that balances the system issues
    - A proven approach that resolves the competing concerns
    - Guidance rather than prescriptive steps

## Key Characteristics of Patterns

### Patterns are NOT Prescriptive Recipes

Patterns provide guidance and principles rather than rigid instructions. A pattern would not tell you exactly which technology to use; instead, it would propose a set of values and considerations to guide you toward a decision that is best for your particular application.

**Example:** - ❌ "Use PostgreSQL with these exact settings" - ✅ "Consider these factors when choosing between relational and document databases for your research data"

### Patterns Document Expert Knowledge

Patterns capture the accumulated wisdom and experience of experts who have solved similar issues many times. They provide a valuable foundation for experience sharing and reuse across projects and teams.

### Patterns Form a Language

A **pattern language** is an organized and coherent set of patterns, each of which describes a issue and the core of a solution. Patterns can reference and build upon each other, creating a rich vocabulary for discussing solutions to complex problems.

## Patterns in Research Software Engineering

### Why Patterns Matter for RSE

Research software engineering operates within a complex research context that includes: - Balancing research agility with software sustainability - Managing sensitive or culturally significant data - Supporting reproducibility and FAIR principles - Enabling collaboration across diverse disciplines - Respecting Indigenous data sovereignty

Patterns help RSE practitioners by: - **Accelerating Development**: Avoid reinventing solutions to common problems - **Improving Quality**: Apply proven approaches with understood trade-offs - **Facilitating Communication**: Create shared vocabulary across teams - **Supporting Decision-Making**: Provide frameworks for evaluating options - **Enabling Learning**: Transfer knowledge from experienced to emerging RSEs

### Types of Patterns in RSE

Patterns in research software engineering can operate at multiple levels. The RSE-CEP prototype uses three active types, with two deferred:

**Implementation Patterns (I)** — Specific technologies, tools, and engineering techniques. Example: RO-Crate packaging for research data, Git workflows for HASS researchers.

**Architectural Patterns (A)** — System shapes, structural principles, workflows, and data governance architectures. Example: Community-delegated access control, provider-agnostic LLM abstraction.

**Design Patterns (D)** — Research problem framing, methodology, evaluation design, and decision frameworks. Example: Inter-rater reliability framework for AI evaluation, semantic load testing criteria.

**Process Patterns** *(deferred)* — Development workflows and practices. Example: Continuous integration for research software.

**Organizational Patterns** *(deferred)* — Team structures and collaboration models. Example: Embedded RSE support model.

For full typology definitions, classification guidance, and section-by-section emphasis per type, see `docs/pattern_typology.md`.

## Pattern Quality Criteria

### Good Patterns Should Be:

**1. Proven in Practice** - Derived from real-world experience - Successfully applied multiple times - Validated in actual research contexts

**2. Context-Specific** - Clearly define when they apply - Acknowledge their limitations - Specify prerequisite conditions

**3. Balance-Oriented** - Explicitly address trade-offs - Present both benefits and drawbacks - Help users make informed decisions

**4. Generative** - Enable creativity and adaptation - Support different implementations - Allow combination with other patterns

**5. Connected** - Reference related patterns - Show how patterns work together - Build toward a pattern language

**6. Accessible** - Written for the target audience - Include concrete examples - Provide implementation guidance

## Patterns vs. Other Knowledge Forms

### Patterns vs. Best Practices

  ---------------------------------------------------------
  Patterns                     Best Practices
  ---------------------------- ----------------------------
  Describe issues AND        Prescribe specific actions
  solutions                    

  Context-dependent            Often presented as universal

  Balance competing issues     Focus on optimal outcomes

  Support multiple             Recommend specific
  implementations              approaches
  ---------------------------------------------------------

### Patterns vs. Principles

  ----------------------------------------
  Patterns              Principles
  --------------------- ------------------
  Concrete and          Abstract and
  actionable            guiding

  Issue-solution      Values and beliefs
  pairs                 

  Situational           Universal
  application           application

  "What" and "How"      "Why"
  ----------------------------------------

### Patterns vs. Tutorials

  ----------------------------------------------------
  Patterns                       Tutorials
  ------------------------------ ---------------------
  Technology-agnostic where      Technology-specific
  possible                       

  Focus on recurring problems    Focus on specific
                                 tasks

  Multiple implementation        Step-by-step
  options                        instructions

  Emphasize trade-offs           Emphasize completion
  ----------------------------------------------------

## Pattern Evolution and Maturity

Patterns evolve through use and refinement:

### Pattern Lifecycle

1.  **Discovery**: Recognize a recurring issue and solution
2.  **Documentation**: Capture the pattern in structured form
3.  **Review**: Validate with community and experts
4.  **Publication**: Make available to broader community
5.  **Application**: Use in real projects
6.  **Refinement**: Update based on experience and feedback
7.  **Maturation**: Becomes well-understood and widely adopted

### Maturity Levels

**Foundational (Mature)** - Well-established and proven - Widely adopted across many projects - Clear understanding of trade-offs - Example: Version control with Git

**Recommended (Validated)** - Proven in multiple similar contexts - Best practice status emerging - Trade-offs generally understood - Example: RO-Crate for research data packaging

**Emerging (Promising)** - Showing promise but needs more validation - Used successfully but not yet widespread - Trade-offs still being explored - Example: Decentralized identity for research

**Experimental (Cutting-edge)** - New or unproven approaches - Limited production experience - Use with caution and close monitoring - Example: Quantum-resistant encryption for long-term archives

## Patterns in the CDL RSE Context

### Special Considerations for HASS & Indigenous Research

Patterns for this community must address:

**Cultural Sensitivity** - Indigenous data sovereignty principles (CARE) - Cultural protocols and permissions - Community consent and engagement - Traditional knowledge protection

**Disciplinary Diversity** - Wide range of research methods - Varied technical capabilities - Different data types and scales - Interdisciplinary collaboration needs

**Ethical and Legal Complexity** - Privacy and consent management - Copyright and cultural rights - Long-term preservation responsibilities - Open access vs. access control

**Sustainability Challenges** - Project-based funding models - Limited technical resources - Knowledge continuity - Long-term maintenance

### Pattern Application Process

When applying a pattern to your research software project:

1.  **Identify the issue**: Recognize that your situation matches the pattern's context
2.  **Understand the Issues**: Consider how the competing concerns apply to your case
3.  **Adapt the Solution**: Tailor the pattern's solution to your specific needs
4.  **Implement Thoughtfully**: Apply the pattern while monitoring outcomes
5.  **Reflect and Share**: Document your experience to help refine the pattern

## Further Reading

### Foundational Works

- Christopher Alexander, "A Pattern Language" (1977)
- Gang of Four, "Design Patterns: Elements of Reusable Object-Oriented Software" (1994)
- Martin Fowler, "Patterns of Enterprise Application Architecture" (2002)

### Research Software Engineering

- "Foundational Competencies and Responsibilities of a Research Software Engineer" (2023)
- Software Sustainability Institute resources
- FAIR4RS Principles documentation

### Indigenous Data Governance

- CARE Principles for Indigenous Data Governance
- Local Contexts: Traditional Knowledge Labels
- OCAP® Principles (Ownership, Control, Access, Possession)

## About This Guide

This guide was developed for the Community Data Lab Research Software Engineering Capacity Enhancement Project, supporting the HASS and Indigenous Research Data Commons.

**Version**: 1.0\
**Last Updated**: January 2026\
**License**: CC BY 4.0

For questions or contributions, please visit: \[Project Repository URL\]

## References

### Foundational Pattern Literature

Alexander, C., Ishikawa, S., & Silverstein, M. (1977). *A Pattern
Language: Towns, Buildings, Construction*. Oxford University Press.

Alexander, C. (1979). *The Timeless Way of Building*. Oxford University
Press.

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design
Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley
Professional.

Fowler, M. (2002). *Patterns of Enterprise Application Architecture*.
Addison-Wesley Professional.

### Research Software Engineering

Goth, F., Alves, R., Braun, M., Castro, L. J., Chourdakis, G., Christ, S., Cohen, J., Erxleben, F., Grad, J., Hagdorn, M., Hodges, T., Juckeland, G., Kempf, D., Lamprecht, A., Linxweiler, J., Schwarzmeier, M., Seibold, H., Thiele, J. P., von Waldow, H. E., & Wittke, S. (2024). Foundational Competencies and Responsibilities of a Research Software Engineer. *F1000Research*, 13:1429. https://doi.org/10.12688/f1000research.157778.1

Software Sustainability Institute. (n.d.). *Research Software Engineering Resources*. Retrieved January 2026, from https://www.software.ac.uk/

### FAIR and CARE Principles

Chue Hong, N. P., Katz, D. S., Barker, M., Lamprecht, A., Martinez, C., Psomopoulos, F. E., Harrow, J., Castro, L. J., Gruenpeter, M., Martinez, P. A., & Honeyman, T. et al. (2022). FAIR Principles for Research Software version 1.0 (FAIR4RS Principles v1.0). *Research Data Alliance*. https://doi.org/10.15497/RDA00068

Barker, M., Chue Hong, N. P., Katz, D. S., Lamprecht, A., Martinez-Ortiz, C., Psomopoulos, F., Harrow, J., Castro, L. J., Gruenpeter, M., Martinez, P. A., & Honeyman, T. et al. (2022). Introducing the FAIR Principles for research software. *Scientific Data*, 9(1), 622. https://doi.org/10.1038/s41597-022-01710-x

Carroll, S. R., Garba, I., Figueroa-Rodríguez, O. L., Holbrook, J., Lovett, R., Materechera, S., Parsons, M., Raseroka, K., Rodriguez-Lonebear, D., Rowe, R., Sara, R., Walker, J. D., Anderson, J., & Hudson, M. (2020). The CARE Principles for Indigenous Data Governance. *Data Science Journal*, 19(1), 43. https://doi.org/10.5334/dsj-2020-043

Research Data Alliance International Indigenous Data Sovereignty Interest Group. (2019). *CARE Principles for Indigenous Data Governance*. The Global Indigenous Data Alliance. https://www.gida-global.org/care

### Additional Resources

Wilkinson, M. D., Dumontier, M., Aalbersberg, I. J., Appleton, G., Axton, M., Baak, A., ... & Mons, B. (2016). The FAIR Guiding Principles for scientific data management and stewardship. *Scientific Data*, 3(1), 160018. https://doi.org/10.1038/sdata.2016.18

Gabriel, R. P. (1996). *Patterns of Software: Tales from the Software Community*. Oxford University Press.

Buschmann, F., Meunier, R., Rohnert, H., Sommerlad, P., & Stal, M. (1996). *Pattern-Oriented Software Architecture, Volume 1: A System of Patterns*. John Wiley & Sons.

Attribution Statement: AIA PAI Hin R Claude4.5 v1.0
