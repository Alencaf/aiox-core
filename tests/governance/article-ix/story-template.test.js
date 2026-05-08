/**
 * Article IX — Story Template enforcement
 *
 * Validates story-tmpl.yaml has required sections `plan` and `test-scenarios`
 * with the right metadata (required: true, ownership rules).
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Only the canonical .aiox-core/product/templates/ path is committed.
// .claude/templates/ is gitignored — local cache, not authoritative.
const TEMPLATE_PATHS = [
  path.resolve(__dirname, '../../../.aiox-core/product/templates/story-tmpl.yaml'),
];

describe.each(TEMPLATE_PATHS)('Story template — %s', (templatePath) => {
  let template;

  beforeAll(() => {
    const raw = fs.readFileSync(templatePath, 'utf-8');
    template = yaml.load(raw);
  });

  test('template loads as valid YAML', () => {
    expect(template).toBeTruthy();
    expect(template.sections).toBeInstanceOf(Array);
  });

  test('section "plan" exists with required: true', () => {
    const planSection = template.sections.find((s) => s.id === 'plan');
    expect(planSection).toBeDefined();
    expect(planSection.required).toBe(true);
  });

  test('section "plan" enforces max 10 lines', () => {
    const planSection = template.sections.find((s) => s.id === 'plan');
    expect(planSection).toBeDefined();
    const guidance = JSON.stringify(planSection);
    expect(guidance).toMatch(/(max[_ -]?lines:\s*10|≤\s*10\s+linhas|máximo\s+10)/i);
  });

  test('section "test-scenarios" exists with required: true', () => {
    const ts = template.sections.find((s) => s.id === 'test-scenarios');
    expect(ts).toBeDefined();
    expect(ts.required).toBe(true);
  });

  test('section "test-scenarios" mandates Given/When/Then format', () => {
    const ts = template.sections.find((s) => s.id === 'test-scenarios');
    expect(ts).toBeDefined();
    const blob = JSON.stringify(ts);
    expect(blob).toMatch(/Given\/When\/Then/);
  });

  test('section "test-scenarios" requires coverage of all AC', () => {
    const ts = template.sections.find((s) => s.id === 'test-scenarios');
    expect(ts).toBeDefined();
    const blob = JSON.stringify(ts).toLowerCase();
    expect(blob).toMatch(/(cobre|cover).*(ac|acceptance)/);
  });

  test('plan section is editable by scrum-master', () => {
    const planSection = template.sections.find((s) => s.id === 'plan');
    expect(planSection).toBeDefined();
    expect(planSection.editors).toEqual(expect.arrayContaining(['scrum-master']));
  });
});
