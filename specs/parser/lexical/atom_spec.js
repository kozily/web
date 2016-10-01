import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeInvalid() {
    return {
      compare(actual) {
        const pass = actual === undefined;
        return { pass };
      },
    };
  },

  toBeLexicalAtom() {
    return {
      compare(actual, expected) {
        const pass = actual &&
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|record|tuple|literal|atom' &&
          actual.get('name') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical atom elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles unquoted atoms correctly', () => {
    expect(parse('oneAtom')).toBeLexicalAtom('oneAtom');
    expect(parse('andthen')).toBeInvalid();
  });

  it('handles quoted atoms correctly', () => {
    expect(parse('\'One Atom\'')).toBeLexicalAtom('One Atom');
    expect(parse('\'One\\\\Atom\'')).toBeLexicalAtom('One\\Atom');
    expect(parse('\'andthen\'')).toBeLexicalAtom('andthen');
  });
});

