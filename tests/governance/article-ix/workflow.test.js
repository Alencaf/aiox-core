/**
 * Article IX — Workflow enforcement
 *
 * story-development-cycle.yaml must include `qa_write_tests` step
 * between `validate` and `implement`, with proper requires/next chain.
 *
 * Also verifies the new task qa-write-tests-from-story.md exists.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOW_PATH = path.resolve(
  __dirname,
  '../../../.aiox-core/development/workflows/story-development-cycle.yaml'
);
const QA_TASK_PATH = path.resolve(
  __dirname,
  '../../../.aiox-core/development/tasks/qa-write-tests-from-story.md'
);

describe('story-development-cycle.yaml', () => {
  let workflow;
  let steps;

  beforeAll(() => {
    const raw = fs.readFileSync(WORKFLOW_PATH, 'utf-8');
    workflow = yaml.load(raw);
    steps = workflow.workflow.sequence;
  });

  test('contains a step with id qa_write_tests', () => {
    const qaStep = steps.find((s) => s.id === 'qa_write_tests');
    expect(qaStep).toBeDefined();
  });

  test('qa_write_tests step is owned by qa agent', () => {
    const qaStep = steps.find((s) => s.id === 'qa_write_tests');
    expect(qaStep).toBeDefined();
    expect(qaStep.agent).toBe('qa');
  });

  test('qa_write_tests requires validate step', () => {
    const qaStep = steps.find((s) => s.id === 'qa_write_tests');
    expect(qaStep).toBeDefined();
    expect(qaStep.requires).toBe('validate');
  });

  test('qa_write_tests next points to implement', () => {
    const qaStep = steps.find((s) => s.id === 'qa_write_tests');
    expect(qaStep).toBeDefined();
    expect(qaStep.next).toBe('implement');
  });

  test('validate step now points to qa_write_tests', () => {
    const validateStep = steps.find((s) => s.id === 'validate');
    expect(validateStep).toBeDefined();
    expect(validateStep.next).toBe('qa_write_tests');
  });

  test('implement step now requires qa_write_tests', () => {
    const implementStep = steps.find((s) => s.id === 'implement');
    expect(implementStep).toBeDefined();
    expect(implementStep.requires).toBe('qa_write_tests');
  });

  test('phases array includes qa_write_tests phase', () => {
    const phases = workflow.workflow.phases || [];
    const phaseStr = JSON.stringify(phases).toLowerCase();
    expect(phaseStr).toMatch(/qa.*write.*tests|tests.*authoring/);
  });
});

describe('qa-write-tests-from-story.md', () => {
  test('task file exists', () => {
    expect(fs.existsSync(QA_TASK_PATH)).toBe(true);
  });

  test('task references Article IX', () => {
    const content = fs.readFileSync(QA_TASK_PATH, 'utf-8');
    expect(content).toMatch(/Article\s+IX/i);
  });

  test('task instructs writing Given/When/Then from AC', () => {
    const content = fs.readFileSync(QA_TASK_PATH, 'utf-8');
    expect(content).toMatch(/Given\/When\/Then/);
    expect(content).toMatch(/(acceptance\s+criteria|AC)/i);
  });

  test('task mandates RED-phase verification (tests must fail initially)', () => {
    const content = fs.readFileSync(QA_TASK_PATH, 'utf-8');
    expect(content).toMatch(/(RED.?phase|tests?\s+must\s+fail|red[\s-]?phase)/i);
  });
});
