import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalVariable() {
    return {
      compare(actual, expected) {
        const pass =
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'variable' &&
          actual.get('identifier') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical variable elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles unquoted variables correctly', () => {
    expect(parse('OneVariable')).toBeLexicalVariable('OneVariable');
  });

  it('handles quoted variables correctly', () => {
    expect(parse('`One Variable`')).toBeLexicalVariable('One Variable');
    expect(parse('`One\\\\Variable`')).toBeLexicalVariable('One\\Variable');
  });
});

