---
title: "Version Control for Research"
pattern_id: RSE-HASS-001
alternative_names:
  - "Git for Researchers"
  - "Research Version Management"
keywords:
  - version-control
  - git
  - reproducibility
  - collaboration
hass_domains:
  - digital-humanities
  - linguistics
version: "0.1.0"
author: mat-bettinson
last_updated: 2026-03-11
---

## Intent

Enable researchers to track, share, and reproduce their work by applying version control practices adapted to HASS research contexts...

## Context

### When This Pattern Applies

- Research projects producing text, code, data, or mixed outputs
- Collaborative projects where multiple contributors edit shared artefacts
- Projects requiring reproducibility or audit trails

### When This Pattern Does NOT Apply

- Purely analogue research workflows with no digital artefacts
- Projects where institutional systems already enforce versioning (e.g. EDRMS)

### Prerequisites

- Basic command-line familiarity or willingness to learn
- Access to a Git hosting platform (GitHub, GitLab, Bitbucket)

## Issues

### Issue 1: Reproducibility

- Research outputs must be traceable to specific versions of inputs and methods
- Reviewers and collaborators need to understand what changed and why
- HASS researchers may lack familiarity with version control tooling

### Issue 2: Collaboration

- Multiple contributors may work on overlapping files simultaneously
- Clear attribution of contributions matters for academic credit
- Different disciplines have different norms for collaborative writing

### Issue 3: Data Sensitivity

- Some research data has consent or ethics constraints on sharing
- Version control systems can inadvertently expose sensitive data in history
- Researchers need clear guidance on what should and should not be versioned

## Solution

### Core Idea

Adopt Git-based version control with conventions tailored to research workflows: meaningful commit messages, branch-per-task workflows, and clear separation of sensitive and non-sensitive content.

### Key Principles

1. **Track intent, not just changes:** Commit messages should explain why a change was made, not just what changed.
2. **Separate concerns:** Keep sensitive data out of version-controlled repositories using `.gitignore` and separate storage.
3. **Lower the barrier:** Provide GUI tools and templates to reduce the learning curve for non-technical researchers.

## Implementation Examples

### Example 1: Digital Humanities Text Corpus

**Context:** A team of literary scholars collaborating on annotated editions of historical texts.

**How They Balanced the Issues:** Used GitHub with a branch-per-chapter workflow, with clear contribution guidelines and a shared glossary of Git terminology for non-technical team members.

**What Worked Well:** Attribution was clear, and the revision history served as a scholarly record of editorial decisions.

## Context-Specific Guidance

### For HASS Research

- Use meaningful branch names that reflect research activities (e.g. `analysis/sentiment-coding`)
- Include a `CONTRIBUTING.md` with discipline-appropriate language
- Consider using GitHub's web interface for collaborators uncomfortable with the command line

### For Indigenous Research

**CARE Principles Application:**
- **Collective Benefit:** Version history supports community ownership of evolving knowledge
- **Authority to Control:** Repository access controls can enforce data governance decisions
- **Responsibility:** Commit history provides transparency about who changed what and when
- **Ethics:** Sensitive cultural materials must never be committed to shared repositories

## Consequences

### What You Gain

- Full audit trail of research decisions and changes
- Ability to reproduce any prior state of the project
- Clear attribution of contributions

### What You Accept

- Learning curve for team members unfamiliar with version control
- Overhead of maintaining good commit hygiene

### Risks to Manage

- Accidentally committing sensitive data — mitigate with `.gitignore` templates and pre-commit hooks
- Repository becoming unwieldy with large binary files — mitigate with Git LFS or separate storage

## Known Uses

### Project 1: AustLit

- **Institution/Domain:** University of Queensland / Literary Studies
- **How They Used It:** Managed collaborative bibliographic data and editorial content using Git-based workflows

### Project 2: GLAM Workbench

- **Institution/Domain:** GLAM sector / Digital Humanities
- **How They Used It:** Used GitHub to version Jupyter notebooks for cultural heritage data exploration

## Related Patterns

### Works Well With

- **Configuration Management:** Versioned configuration ensures reproducible environments
- **Data Management Planning:** Version control integrates with broader data governance

### Alternative Approaches

- **Document Management Systems:** When institutional EDRMS is mandated, version control may be supplementary rather than primary
