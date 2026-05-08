/**
 * Article IX — Checklists enforcement
 *
 * story-draft-checklist.md must check Plan + Test Scenarios presence.
 * story-dod-checklist.md must check tests-before-code via git history.
 */

const fs = require('fs');
const path = require('path');

const DRAFT_CHECKLIST = path.resolve(
  __dirname,
  '../../../.aiox-core/product/checklists/story-draft-checklist.md'
);
const DOD_CHECKLIST = path.resolve(
  __dirname,
  '../../../.aiox-core/product/checklists/story-dod-checklist.md'
);

describe('story-draft-checklist.md', () => {
  let content;
  beforeAll(() => {
    content = fs.readFileSync(DRAFT_CHECKLIST, 'utf-8');
  });

  test('contains Plan section validation item (≤10 lines)', () => {
    expect(content).toMatch(/Plan\s+section\s+present.*≤\s*10\s+linhas/i);
  });

  test('contains Test Scenarios validation item (Given/When/Then)', () => {
    expect(content).toMatch(/Test\s+scenarios.*Given\/When\/Then/i);
  });

  test('contains coverage check: scenarios cover all AC', () => {
    expect(content).toMatch(/Test\s+scenarios\s+cover\s+all\s+AC/i);
  });

  test('declares Article IX category in validation table', () => {
    expect(content).toMatch(/Article\s+IX/i);
  });
});

describe('story-dod-checklist.md', () => {
  let content;
  beforeAll(() => {
    content = fs.readFileSync(DOD_CHECKLIST, 'utf-8');
  });

  test('contains tests-before-code item with git verifiability', () => {
    expect(content).toMatch(/Tests\s+written\s+BEFORE\s+implementation\s+code/i);
    expect(content).toMatch(/(git\s+history|verifiable)/i);
  });

  test('contains RED→GREEN cycle verification item', () => {
    expect(content).toMatch(/(RED.*GREEN|red[\s-]?phase.*green[\s-]?phase)/i);
  });

  test('declares Article IX category in DoD', () => {
    expect(content).toMatch(/Article\s+IX/i);
  });
});
