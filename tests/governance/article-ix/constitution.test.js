/**
 * Article IX — Tests-First, Plan-First (NON-NEGOTIABLE)
 *
 * Validates that the Constitution declares Article IX with the required
 * structure: severity, regras MUST, gate definition, and rationale.
 *
 * RED-phase: this suite was authored BEFORE Article IX was added to
 * constitution.md. It MUST fail on the initial run, then pass after the
 * amendment is committed. Verifiable via git history.
 */

const fs = require('fs');
const path = require('path');

const CONSTITUTION_PATH = path.resolve(
  __dirname,
  '../../../.aiox-core/constitution.md'
);

describe('Constitution — Article IX (Tests-First, Plan-First)', () => {
  let content;

  beforeAll(() => {
    content = fs.readFileSync(CONSTITUTION_PATH, 'utf-8');
  });

  test('declares section IX with NON-NEGOTIABLE severity', () => {
    expect(content).toMatch(/###\s+IX\.\s+Tests-First,\s+Plan-First\s+\(NON-NEGOTIABLE\)/);
  });

  test('mandates Plan section in every story (≤10 lines)', () => {
    expect(content).toMatch(/MUST:\s+Toda\s+story\s+DEVE\s+ter\s+seção\s+\*\*Plan\*\*/i);
    expect(content).toMatch(/máximo\s+10\s+linhas/i);
  });

  test('mandates Test Scenarios in Given/When/Then format before status Ready', () => {
    expect(content).toMatch(/MUST:\s+Toda\s+story\s+DEVE\s+ter\s+seção\s+\*\*Test\s+Scenarios\*\*/i);
    expect(content).toMatch(/Given\/When\/Then/);
  });

  test('blocks @dev from starting implementation without RED-phase tests committed', () => {
    expect(content).toMatch(/MUST\s+NOT:\s+@dev\s+inicia\s+implementação\s+sem\s+suite\s+de\s+testes\s+red-phase/i);
  });

  test('declares automatic gate that BLOCKS Ready→InProgress transition', () => {
    // Gate name appears in Article IX text and in the Active Gates Summary table
    expect(content).toMatch(/`?story-readiness`?/);
    expect(content).toMatch(/BLOCK/);
    // Verify they co-occur in the same row of the gates table OR same paragraph
    const gateLines = content
      .split('\n')
      .filter((l) => /story-readiness/.test(l));
    expect(gateLines.length).toBeGreaterThan(0);
    expect(gateLines.some((l) => /BLOCK/i.test(l))).toBe(true);
  });

  test('rationale references token economy and rework reduction', () => {
    expect(content).toMatch(/(token|rework|retrabalho)/i);
  });

  test('lists gate severity table includes story-readiness BLOCK', () => {
    expect(content).toMatch(/story-readiness/);
  });
});
