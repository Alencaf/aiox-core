# Task: Optimize TDD Discipline (Article IX Compliance)

**Task ID:** CCM-OPTIM-005
**Version:** 1.0.0
**Command:** `*optimize-tdd-discipline`
**Agent:** Sigil (config-engineer) + Conduit (project-integrator)
**Constitution:** Article IX (Tests-First, Plan-First) — NON-NEGOTIABLE
**Purpose:** Audit a project's stories and workflow for TDD/Plan-First compliance
and recommend remediation. The goal is token economy + rework reduction:
behavior-first artifacts shrink Claude's speculative output and give the
orchestrator the highest-leverage review point (test scenarios, before code).

---

## Why This Task Exists

This task encodes a learning recurrent across Claude Code projects:

> **The earlier expected behavior becomes a verifiable artifact, the less
> code Claude invents and the less rework occurs in review.**

Three corollaries:
1. Plan ≤10 lines > prose paragraphs — eliminates 80% of architectural drift
2. Tests-before-code is not ritual TDD — it's context compression (a failing
   test is an executable spec; a prose AC is open interpretation)
3. The orchestrator should review behavior, not implementation. Reviewing tests
   before code exists is the highest leverage point.

---

## Overview

```
  +------------------+     +------------------+     +------------------+
  | 1. Audit project | --> | 2. Audit stories | --> | 3. Audit workflow|
  |    constitution  |     |    for Plan +    |     |    for qa_write_ |
  |    for Article IX|     |    Test Scenarios|     |    tests step    |
  +------------------+     +------------------+     +------------------+
       |                                                    |
       v                                                    v
  +------------------+     +------------------+     +------------------+
  | 4. Audit checklists| --> | 5. Score TDD    | --> |  REMEDIATION    |
  |    for tests-before|     |    maturity     |     |  PLAN           |
  |    -code           |     |                 |     |                 |
  +------------------+     +------------------+     +------------------+
```

---

## Inputs

| Field | Type | Source | Required | Validation |
|-------|------|--------|----------|------------|
| project_root | string | Working directory | Yes | Must contain `.aiox-core/` or `.claude/` |
| dry_run | boolean | User parameter | No | If true, audit only, no changes |
| target_articles | string[] | User parameter | No | Default: `["IX"]` — extendable |

---

## Preconditions

- Project has AIOX framework installed (or .claude/ alone)
- At least one story exists in `docs/stories/` (or `docs/stories/epics/*/stories/`)

---

## Execution Phases

### Phase 1: Constitution Audit (Article IX presence)

1. Locate `.aiox-core/constitution.md`
2. Verify presence of:
   - [ ] Section "IX. Tests-First, Plan-First (NON-NEGOTIABLE)"
   - [ ] MUST clauses for Plan section (≤10 lines) and Test Scenarios (Given/When/Then)
   - [ ] MUST NOT clauses blocking @dev start without red-phase tests
   - [ ] Gate: `story-readiness` listed in Active Gates Summary with severity BLOCK

If missing: flag for amendment via `propose-modification` workflow.

### Phase 2: Story Template Audit

1. Locate story template(s):
   - `.aiox-core/product/templates/story-tmpl.yaml`
   - `.claude/templates/story-tmpl.yaml`
2. For each, verify:
   - [ ] Section `plan` exists with `required: true` and `max_lines: 10`
   - [ ] Section `test-scenarios` exists with `required: true` and `format: given-when-then`
   - [ ] Both sections list `qa-agent` or `scrum-master` as editor

### Phase 3: Workflow Audit

1. Locate `.aiox-core/development/workflows/story-development-cycle.yaml`
2. Verify sequence contains:
   - [ ] Step `qa_write_tests` with `agent: qa`, `requires: validate`, `next: implement`
   - [ ] Step `validate` has `next: qa_write_tests`
   - [ ] Step `implement` has `requires: qa_write_tests`
3. Locate `.aiox-core/development/tasks/qa-write-tests-from-story.md`
   - [ ] Task file exists
   - [ ] Task references Article IX
   - [ ] Task instructs RED-phase verification

### Phase 4: Checklists Audit

1. `.aiox-core/product/checklists/story-draft-checklist.md`:
   - [ ] Item: "Plan section present (≤10 linhas)"
   - [ ] Item: "Test scenarios in Given/When/Then format"
   - [ ] Item: "Test scenarios cover all AC"
   - [ ] Article IX category in validation table
2. `.aiox-core/product/checklists/story-dod-checklist.md`:
   - [ ] Item: "Tests written BEFORE implementation code (verifiable via git history)"
   - [ ] Item: "RED-phase verified" + "GREEN-phase achieved"
   - [ ] Article IX category in DoD

### Phase 5: Story Sample Audit

For each story in `docs/stories/` (sample up to 10):
1. Parse the story markdown
2. Check sections:
   - [ ] `## Plan` exists and has ≤10 lines
   - [ ] `## Test Scenarios` exists with at least one Given/When/Then per AC
3. Score each story: COMPLIANT / PARTIAL / NON-COMPLIANT

### Phase 6: TDD Maturity Score

Score the project on a 0-100 scale:

| Component | Weight | Compliant signals |
|-----------|--------|-------------------|
| Constitution Article IX | 25% | All Phase 1 items checked |
| Story templates | 20% | All Phase 2 items checked |
| Workflow + qa task | 25% | All Phase 3 items checked |
| Checklists | 15% | All Phase 4 items checked |
| Story sample compliance | 15% | % of sampled stories COMPLIANT |

Maturity levels:
- **0-40:** Non-compliant — Article IX not adopted
- **41-70:** Partial — Article IX defined but not enforced in stories
- **71-90:** Adopted — Article IX enforced, stories follow it
- **91-100:** Mastered — full TDD discipline observable across all stories

---

## Output Format

```markdown
## TDD Discipline Audit Report (Article IX)

**Project:** {project_name}
**Date:** {YYYY-MM-DD}
**Maturity Score:** {N}/100 ({level})

### Phase 1 — Constitution
- [x/ ] Article IX section present
- [x/ ] All MUST/MUST NOT clauses present
- [x/ ] Gate `story-readiness` declared with BLOCK severity

### Phase 2 — Templates
- [x/ ] Plan section required, max_lines: 10
- [x/ ] Test Scenarios section required, Given/When/Then format

### Phase 3 — Workflow
- [x/ ] qa_write_tests step in sequence
- [x/ ] qa-write-tests-from-story.md task exists

### Phase 4 — Checklists
- [x/ ] story-draft-checklist enforces Plan + Test Scenarios
- [x/ ] story-dod-checklist enforces tests-before-code

### Phase 5 — Stories Sample
| Story | Plan present | Test Scenarios present | Status |
|-------|--------------|------------------------|--------|
| ... | ... | ... | COMPLIANT/PARTIAL/NON-COMPLIANT |

### Remediation Plan (sorted by impact)

1. **{Title}** — Impact: HIGH/MED/LOW — Effort: Quick/Medium/Investment
   {Specific action items}
```

---

## Veto Conditions

- **NEVER** silently modify a project's Constitution — always go through `propose-modification`
- **NEVER** mark a project as compliant without Phase 5 (stories sample) verification
- **NEVER** remove Article IX gates to reduce friction — solve the friction, keep the gate

---

## Completion Criteria

- [ ] All 5 phases completed
- [ ] Maturity score calculated
- [ ] Remediation plan delivered with prioritized actions
- [ ] Sample of stories assessed for actual compliance (not just template presence)

---

## Related

- Constitution: Article IX (Tests-First, Plan-First)
- Squad task: `optimize-context.md` (companion: token economy via context shaping)
- Squad task: `optimize-workflow.md` (companion: friction reduction across workflow)
