import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalFloat() {
    return {
      compare(actual, expected) {
        const pass = actual &&
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|number|float' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical float elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles floats correctly', () => {
    expect(parse('12.')).toBeLexicalFloat(12.0);
    expect(parse('12.34')).toBeLexicalFloat(12.34);
    expect(parse('~12.34')).toBeLexicalFloat(-12.34);
    expect(parse('12.e1')).toBeLexicalFloat(120);
    expect(parse('1.54045e2')).toBeLexicalFloat(154.045);
    expect(parse('12.e~1')).toBeLexicalFloat(1.2);
    expect(parse('~1.54045e2')).toBeLexicalFloat(-154.045);
    expect(parse('1.54045e~2')).toBeLexicalFloat(0.0154045);
    expect(parse('~1.54045e~2')).toBeLexicalFloat(-0.0154045);
    expect(parse('1.54045E2')).toBeLexicalFloat(154.045);
    expect(parse('~1.54045E2')).toBeLexicalFloat(-154.045);
    expect(parse('1.54045E~2')).toBeLexicalFloat(0.0154045);
    expect(parse('~1.54045E~2')).toBeLexicalFloat(-0.0154045);
  });
});

