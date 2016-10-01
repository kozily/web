import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalChar() {
    return {
      compare(actual, expected) {
        const pass = actual &&
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|number|int|char' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical char elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles numeric characters correclty', () => {
    expect(parse('40')).toBeLexicalChar(40);
    expect(parse('255')).toBeLexicalChar(255);
  });

  it('handles explicit characters correctly', () => {
    expect(parse('&a')).toBeLexicalChar('a'.charCodeAt(0));
    expect(parse('& ')).toBeLexicalChar(' '.charCodeAt(0));
  });

  it('handles octal characters correctly', () => {
    expect(parse('&\\101')).toBeLexicalChar(65);
  });

  it('handles hexal characters correctly', () => {
    expect(parse('&\\xff')).toBeLexicalChar(255);
    expect(parse('&\\X0A')).toBeLexicalChar(10);
    expect(parse('&\\XfA')).toBeLexicalChar(250);
  });

  it('handles escaped character correctly', () => {
    expect(parse('&\\a')).toBeLexicalChar(7);
    expect(parse('&\\b')).toBeLexicalChar(8);
    expect(parse('&\\f')).toBeLexicalChar(12);
    expect(parse('&\\n')).toBeLexicalChar(10);
    expect(parse('&\\r')).toBeLexicalChar(13);
    expect(parse('&\\t')).toBeLexicalChar(9);
    expect(parse('&\\v')).toBeLexicalChar(11);
    expect(parse('&\\\\')).toBeLexicalChar(92);
    expect(parse('&\\\'')).toBeLexicalChar(39);
    expect(parse('&\\"')).toBeLexicalChar(34);
    expect(parse('&\\`')).toBeLexicalChar(96);
    expect(parse('&\\&')).toBeLexicalChar(38);
  });
});

