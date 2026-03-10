# Configuration Management for Research Software

*Separating settings from code to support multiple environments and reproducible research*

**Alternative Names:** Environment Configuration, Settings Management, Config-as-Code

---

## Pattern Metadata

| Field | Value |
|-------|-------|
| **Pattern ID** | RSE-HASS-002 |
| **Keywords** | configuration, environment-management, reproducibility, deployment, software-development |
| **Maturity Level** | Foundational (Mature) |
| **Author(s)** | CDL RSE Team, ARDC |
| **Version** | 1.0.0 |
| **Last Updated** | 2026-02-10 |

---

## Intent

Enable research software to run in different environments (development, testing, production) and on different machines without changing code, while keeping sensitive information secure and supporting reproducible research.

---

## Context

### When This Pattern Applies

- Your software needs to run on your laptop, a server, and collaborators' machines
- Database URLs, API keys, or file paths differ between environments
- You need different settings for development vs. production
- Multiple researchers work on the same codebase
- Your software processes data from different locations
- You want others to reproduce your analysis

### When This Pattern Does NOT Apply

- Extremely simple single-file scripts that never change environment
- Throw-away code for one-time data exploration
- Software that truly has zero configuration needs

### Prerequisites

- Basic understanding of your programming language
- Familiarity with files and directories
- Version control (Git) usage

---

## Issues

### Issue 1: Flexibility vs. Simplicity

- **Description:** Software needs to run in different environments with different settings, but hard-coding everything makes the code rigid and environment-specific
- **Why it matters:** Hard-coded paths like `/Users/jane/data/` won't work on anyone else's machine; code becomes unmaintainable
- **Who is affected:** All developers, collaborators, users

### Issue 2: Security vs. Convenience

- **Description:** API keys and passwords need to be accessible to the software but shouldn't be visible in version control or shared accidentally
- **Why it matters:** Accidentally committing passwords to GitHub exposes your systems; but remembering to change them everywhere is error-prone
- **Who is affected:** System administrators, security teams, researchers handling sensitive data

### Issue 3: Reproducibility vs. Adaptability

- **Description:** Research must be reproducible with exact settings, but software also needs to adapt to different computing environments
- **Why it matters:** Scientific integrity requires exact replication, but research needs to run on university clusters, cloud systems, and personal laptops
- **Who is affected:** Researchers, peer reviewers, replication studies

### Key Constraints

- Can't ask users to edit code to change settings
- Can't commit secrets to version control
- Must document what settings are needed
- Should be simple enough for researchers with basic coding skills

---

## Motivating Example

**The Situation:**

A research team built a Python script to analyze historical census data. The script connected to a PostgreSQL database, processed CSV files, and generated visualizations. Three researchers across two universities used the code.

**The Issues That Emerged:**

The original script looked like this:
```python
database_url = "postgresql://localhost:5432/census_data"
data_folder = "/Users/sarah/Documents/research/census_2024"
api_key = "sk_live_abc123xyz789"  # OpenAI API key

# ... rest of code ...
```

Within weeks:
- Collaborator couldn't run the code because their database was on a different server
- Another researcher's data was in `C:\Data\census\` not `/Users/sarah/...`
- The API key was accidentally committed to GitHub and had to be revoked
- When moving to the university cluster, needed to edit code in multiple places
- Reviewers asking to reproduce the analysis couldn't figure out what settings to use

**Why Balance Is Needed:**

The team needed code that worked everywhere without modification, kept secrets secure, and documented exactly what settings produced the published results.

---

## Solution

### Core Idea

Store all environment-specific settings in separate configuration files (not in the code), use environment variables for secrets, and provide clear documentation and templates for users to create their own configurations.

### Key Principles

1. **Separation of Code and Config:** Code contains logic; config files contain settings
2. **Version Template, Not Values:** Commit example configs to Git; never commit real secrets
3. **Environment-Specific Files:** Different config files for development, testing, production
4. **Sensible Defaults:** Provide default values where reasonable; require explicit config for critical settings
5. **Clear Documentation:** Document every configuration option and provide working examples

### Solution Structure

```
research-project/
├── src/
│   └── analysis.py          # Code (no hard-coded settings)
├── config/
│   ├── config.example.yaml  # Template (committed to Git)
│   ├── config.dev.yaml      # Development settings (in .gitignore)
│   ├── config.prod.yaml     # Production settings (in .gitignore)
│   └── README.md            # Config documentation
├── .env.example             # Environment variables template
├── .env                     # Actual secrets (in .gitignore)
├── .gitignore               # Excludes config.*.yaml and .env
└── README.md                # Setup instructions
```

### How the Issues Are Balanced

- **Issue 1 (Flexibility vs. Simplicity)** is balanced by: Providing config templates that users copy and customize; code automatically loads the right config for the environment

- **Issue 2 (Security vs. Convenience)** is balanced by: Storing secrets in `.env` files that are never committed; providing `.env.example` templates; code reads from environment variables

- **Issue 3 (Reproducibility vs. Adaptability)** is balanced by: Config files document exact settings used; can share config (without secrets) alongside publications; same code adapts to any environment via config

### Values and Considerations

**When organizing configuration:**
- ✓ Consider: Grouping related settings (database, paths, API credentials)
- ✓ Consider: Using standard config formats (YAML, JSON, .env) that tools already support
- ✓ Weigh: Simplicity of single file vs. organization of multiple files

**When handling secrets:**
- ✓ Ensure: Secrets never appear in version control
- ✓ Ensure: `.gitignore` is set up correctly from day one
- ✓ Consider: Using secret management services for production (AWS Secrets Manager, Azure Key Vault)

**When documenting configuration:**
- ✓ Provide: Working example with dummy values
- ✓ Explain: What each setting does and what values are acceptable
- ✓ Document: Which settings are required vs. optional

---

## Implementation Examples

### Example 1: Python with YAML Config

**Context:** 
Text analysis research project; Python 3.10; needs database connection, file paths, and API key for NLP service.

**Link to Details:** 

### Example 2: R with Environment Variables

**Context:**
Historical GIS project; R language; needs different data paths for each researcher; minimal configuration needs.

**Link to Details:** 

---

## Context-Specific Guidance

### For HASS Research

- Prioritize simplicity: most HASS researchers aren't professional programmers
- Provide complete working examples, not just fragments
- Document in plain language, not jargon
- Consider providing a setup script that creates config files interactively

### For Indigenous Research

- Configuration should support community-controlled infrastructure
- May need separate configs for community servers vs. researcher laptops
- Document data sovereignty considerations (where data lives, who controls it)
- Config files are good place to document ethical approvals and permissions

### For Different Scales

**Solo Researcher:**
- Single config file is sufficient
- Can use simple text files or even commented variables at top of script
- Focus on documenting settings for future you

**Small Team (2-5 people):**
- Separate dev configs per person
- Shared test/production configs
- Document setup process clearly

**Large Project (5+ people):**
- Structured config with validation
- Automated testing of configurations
- CI/CD pipelines using config files
- Consider config management tools

---

## Consequences

### What You Gain

- ✅ **Portability:** Code runs anywhere without modification
- ✅ **Security:** Secrets stay out of version control
- ✅ **Collaboration:** Team members use same code with different settings
- ✅ **Reproducibility:** Config files document exact settings used
- ✅ **Maintainability:** Changing a setting doesn't require code changes

### What You Accept

- ⚖️ **Initial Setup:** Users need to create their config files (but only once)
- ⚖️ **Extra Files:** More files to manage beyond the code itself
- ⚖️ **Documentation Burden:** Must document configuration options clearly

### Risks to Manage

- ⚠️ **Forgetting .gitignore** → Mitigation: Set up `.gitignore` in first commit; use pre-commit hooks
- ⚠️ **Config Drift** → Mitigation: Keep example configs updated; document when adding new settings
- ⚠️ **Unclear Errors** → Mitigation: Validate config at startup; provide helpful error messages
- ⚠️ **Over-Configuration** → Mitigation: Only make things configurable if they actually vary between environments

---

## Known Uses



---

## Related Patterns

### Works Well With

- **Version Control for Research Data:** Config files document processing parameters → [See RSE-HASS-001]
- **Containerization (Docker):** Configs injected into containers → []
- **Automated Testing:** Different configs for test vs. production → []

### Alternative Approaches

- **Command-Line Arguments:** Pass settings via CLI flags instead of config files → []
  - Choose config files when: Many settings; settings reused frequently; settings complex
  - Choose CLI arguments when: Few settings; different every run; simple values

### Typical Sequence

```
Project Setup → [Configuration Management] → Version Control → Automated Testing → Deployment
```

---

## Common Variations

### Variation 1: Hierarchical Configs

- **When:** Complex applications with many settings
- **Key difference:** Multiple config files that override each other (defaults → environment → local)
- **Link:** 

### Variation 2: Config Validation Schemas

- **When:** Need to ensure configs are valid before running
- **Key difference:** Use JSON Schema or similar to validate configs
- **Link:** 

---

## Pitfalls to Avoid

### Anti-Pattern: Config Files Still in Git

- **What happens:** `.env` or `config.prod.yaml` accidentally committed with secrets
- **Why it's problematic:** Exposes passwords, API keys; security breach
- **Instead:** Set up `.gitignore` immediately; use `git-secrets` or similar tools; review commits

### Common Mistake: No Documentation

- **Warning signs:** Config template exists but no explanation of what settings mean
- **Guidance:** Every config option needs a comment; provide working example; document valid value ranges

### Common Mistake: Making Everything Configurable

- **Warning signs:** 100+ config options; nobody remembers what they all do
- **Guidance:** Only make things configurable if they actually need to vary; hard-code reasonable defaults

---

## Resources

### Learning Materials

- Twelve-Factor App - Config: https://12factor.net/config
- Python dotenv Tutorial: https://github.com/theskumar/python-dotenv
- The Carpentries - Good Code Practices: https://carpentries-incubator.github.io/good-enough-practices/

### Code Examples

- Python config example: https://github.com/example/python-config-example
- R config example: https://github.com/example/r-config-example
- Node.js config example: https://github.com/example/nodejs-config-example

### Tools and Platforms

*Tools that support this pattern:*
- **python-dotenv:** Load environment variables in Python → https://github.com/theskumar/python-dotenv
- **PyYAML:** YAML parsing for Python → https://pyyaml.org/
- **dotenv (Node.js):** Environment variable management → https://github.com/motdotla/dotenv
- **config (R):** Configuration management for R → https://github.com/rstudio/config
- **git-secrets:** Prevent committing secrets → https://github.com/awslabs/git-secrets

### Further Reading

- Goodliffe, P. (2006). *Code Craft: The Practice of Writing Excellent Code*. No Starch Press. [Chapter on Configuration]
- Wilson, G., et al. (2017). Good enough practices in scientific computing. *PLOS Computational Biology*, 13(6). https://doi.org/10.1371/journal.pcbi.1005510

---

## Validation Checklist

**Essential Elements:**
- [ ] No hard-coded paths, URLs, or credentials in code
- [ ] `.gitignore` excludes actual config files with secrets
- [ ] Example/template config files are provided
- [ ] README explains how to set up configuration
- [ ] Code validates configuration at startup

**Security:**
- [ ] Secrets stored in environment variables or separate files
- [ ] No secrets committed to version control (check history!)
- [ ] `.env.example` shows what variables are needed

**Usability:**
- [ ] Config options are documented
- [ ] Sensible defaults provided where possible
- [ ] Error messages help users fix config problems

---

## How to Contribute

- **GitHub Issues:** https://github.com/###
- **Discussion Forum:** 
- **Email:** 

**We Welcome:**
- Language-specific examples
- Config validation approaches
- Tools and libraries we missed

---

## Citation

**APA:**
```
CDL RSE Team. (2026). Configuration Management for Research Software. 
CDL Recommended Patterns in RSE for HASS & Indigenous Research, RSE-HASS-003. 
https://doi.org/10.5281/zenodo.example003
```

**BibTeX:**
```bibtex
@techreport{rse-hass-002_2026,
  author = {{CDL RSE Team}},
  title = {Configuration Management for Research Software},
  institution = {Australian Research Data Commons},
  year = {2026},
  series = {CDL Recommended Patterns in RSE},
  number = {RSE-HASS-002},
  doi = {},
  url = {}
}
```

---

## Metadata

| Field | Value |
|-------|-------|
| **DOI** | 10.5281/zenodo.example003 |
| **License** | CC BY 4.0 |
| **Repository** | https://github.com/### |
| **Version History** | https://github.com/###/CHANGELOG.md |

---

## Acknowledgments

This pattern was developed with input from:
- ARDC HASS and Indigenous Research Data Commons


Funded by the Australian Research Data Commons (ARDC), enabled by NCRIS.

---

## Key References

Alexander, C. (1977). *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press.

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.

Wiggins, A. (2012). *The Twelve-Factor App*. https://12factor.net/

Wilson, G., Bryan, J., Cranston, K., Kitzes, J., Nederbragt, L., & Teal, T. K. (2017). Good enough practices in scientific computing. *PLOS Computational Biology*, 13(6), e1005510. https://doi.org/10.1371/journal.pcbi.1005510

---

**Pattern Version 1.0.0**  
**Developed by:** CDL RSE Capacity Enhancement Project  
**License:** CC BY 4.0  
**Pattern Repository:** https://github.com/###

Attribution Statement: AIA PAI Hin R Claude4.5 v1.0
