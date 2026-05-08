# Task: QA Write Tests from Story (Article IX — Tests-First)

**Task ID:** QA-WRITE-TESTS-001
**Version:** 1.0.0
**Command:** `*write-tests-from-story`
**Agent:** @qa (Quinn)
**Constitution:** Article IX (Tests-First, Plan-First) — NON-NEGOTIABLE
**Purpose:** Convert the story's Test Scenarios (Given/When/Then) into a red-phase
test suite — executable tests that fail against the current/empty implementation,
to be committed BEFORE @dev starts coding.

---

## Overview

```
  Validated Story
       |
       v
  +--------------------+
  | 1. Read Test       |
  |    Scenarios       |
  +--------------------+
       |
       v
  +--------------------+
  | 2. Map 1:1 scenario|
  |    -> test case    |
  +--------------------+
       |
       v
  +--------------------+
  | 3. Write tests in  |
  |    project's       |
  |    framework       |
  +--------------------+
       |
       v
  +--------------------+
  | 4. RED-phase: run  |
  |    suite, verify   |
  |    all fail        |
  +--------------------+
       |
       v
  +--------------------+
  | 5. Commit on story |
  |    branch          |
  +--------------------+
       |
       v
  +--------------------+
  | 6. Orchestrator    |
  |    review behavior |
  +--------------------+
       |
       v
   Story -> InProgress
```

---

## Inputs

| Field | Type | Source | Required | Validation |
|-------|------|--------|----------|------------|
| story_path | string | Workflow context | Yes | Story file exists with status=Ready |
| test_framework | string | Project config | Yes | One of: jest, vitest, pytest, etc. |
| story_branch | string | Git context | Yes | Current branch is feature/STORY-* |

---

## Preconditions

- Story has passed validation (status: Ready)
- Story contains valid Test Scenarios section in Given/When/Then format
- Story contains valid Plan section (≤10 lines)
- Project has a configured test framework
- Branch `feature/STORY-{id}` is checked out

---

## Execution Phases

### Phase 1: Read Test Scenarios

1. Open the story file and extract:
   - Acceptance Criteria (numbered list)
   - Test Scenarios section (Given/When/Then per AC)
2. Verify each AC has at least one corresponding scenario
3. If coverage is incomplete: HALT, route back to @sm for expansion

### Phase 2: Map Scenarios to Test Cases

For each scenario:
1. Identify the unit under test (function, class, endpoint, component)
2. Translate Given → setup/fixtures
3. Translate When → action/call
4. Translate Then → assertion(s)

**Rule:** 1 scenario → at least 1 test case. Do NOT invent additional scenarios.
If you discover gaps, route back to @sm — never expand the spec yourself.

### Phase 3: Write Tests in Project Framework

1. Locate the project's test directory and naming convention
2. Create test file(s) following project structure:
   - JavaScript/TypeScript: `**/*.test.{js,ts}` or `tests/**/*.test.js`
   - Python: `tests/test_*.py`
   - etc.
3. Write tests using the project's framework idioms (jest `describe/test`,
   vitest, pytest, etc.)
4. Each test:
   - Has a clear name derived from the scenario title
   - Includes a comment referencing the AC number it covers
   - Implements Given/When/Then structure faithfully

### Phase 4: RED-phase Verification

1. Run the test suite
2. Verify ALL new tests FAIL (red-phase)
3. Reasons they should fail:
   - Module/function under test does not exist yet
   - Function exists but returns nothing or wrong value
   - Endpoint not implemented
4. If any new test PASSES: investigate. Either:
   - Implementation already exists (story may be redundant — escalate)
   - Test is too lax — tighten the assertion
   - Test has a bug — fix it

**A test that passes against empty implementation is NOT a valid red-phase test.**

### Phase 5: Commit on Story Branch

1. Stage only the new test files
2. Commit with message: `test(STORY-{id}): red-phase suite for {short description}`
3. Push to story branch (if remote tracking is set)

### Phase 6: Orchestrator Review

1. Surface to orchestrator (Eliel or designated agent):
   - List of test files created
   - Mapping table: AC # → Scenario → Test name
   - RED-phase output (terminal log of failing tests)
2. HALT until orchestrator approves the codified behavior
3. On approval: transition story to InProgress and notify @dev

---

## Output Format

```markdown
## QA Red-Phase Suite Report

**Story:** {story_id} — {story_title}
**Branch:** feature/STORY-{id}
**Framework:** {test_framework}
**Commit:** {red_phase_commit_hash}

### Coverage Map

| AC # | Scenario | Test File | Test Name | Status |
|------|----------|-----------|-----------|--------|
| 1 | Scenario 1 | tests/x.test.js | "...AC1..." | RED ✓ |
| 2 | Scenario 2 | tests/y.test.js | "...AC2..." | RED ✓ |

### Red-Phase Verification

```
{terminal output showing all tests fail}
```

### Pending Orchestrator Review

Awaiting approval to transition story to InProgress.
```

---

## Veto Conditions

- **NEVER** pass a test by stubbing the implementation in the test file
- **NEVER** write tests that pass against empty/missing implementation (not red-phase)
- **NEVER** invent test scenarios not present in the story (Article IV — No Invention)
- **NEVER** skip the orchestrator review step — it is the highest-leverage gate
- **NEVER** commit tests on master/main — always on feature branch

---

## Completion Criteria

- [ ] All Test Scenarios from story translated 1:1 to test cases
- [ ] Every AC has at least one test
- [ ] Suite runs and all tests fail (red-phase verified)
- [ ] Commit on feature branch with clear message
- [ ] Orchestrator review presented with coverage map and terminal output
- [ ] Story status transitioned to InProgress upon approval

---

## Related

- Constitution: Article IX (Tests-First, Plan-First) — NON-NEGOTIABLE
- Workflow: `story-development-cycle.yaml` (step: qa_write_tests)
- Checklist: `story-draft-checklist.md` (section 5.5)
- Checklist: `story-dod-checklist.md` (section 3.5)
- Template: `story-tmpl.yaml` (sections plan, test-scenarios)
