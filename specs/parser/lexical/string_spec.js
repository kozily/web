import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalString() {
    return {
      compare(actual, expected) {
        const pass = actual &&
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|record|tuple|list|string' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical string elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles parsing correctly', () => {
    expect(parse('"one quite interesting \\\\ \\n STRING"'))
      .toBeLexicalString('one quite interesting \\ \n STRING');
  });
});

