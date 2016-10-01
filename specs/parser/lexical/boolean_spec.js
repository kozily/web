import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalBoolean() {
    return {
      compare(actual, expected) {
        const pass =
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|record|tuple|literal|bool' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical boolean elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles true correctly', () => {
    expect(parse('true')).toBeLexicalBoolean(true);
  });

  it('handles false correctly', () => {
    expect(parse('false')).toBeLexicalBoolean(false);
  });
});
