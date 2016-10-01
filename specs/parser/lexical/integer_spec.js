import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

const customMatchers = {
  toBeLexicalInteger() {
    return {
      compare(actual, expected) {
        const pass = actual &&
          actual.get('node') === 'lexical' &&
          actual.get('type') === 'value|number|int' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing lexical integer elements', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles decimal integers correctly', () => {
    expect(parse('1986')).toBeLexicalInteger(1986);
    expect(parse('~1986')).toBeLexicalInteger(-1986);
  });

  it('handles octal integers correctly', () => {
    expect(parse('011')).toBeLexicalInteger(9);
    expect(parse('~011')).toBeLexicalInteger(-9);
  });

  it('handles hexal integers correctly', () => {
    expect(parse('0x11')).toBeLexicalInteger(17);
    expect(parse('0X11')).toBeLexicalInteger(17);
    expect(parse('~0x11')).toBeLexicalInteger(-17);
    expect(parse('~0X11')).toBeLexicalInteger(-17);
  });

  it('handles binary integers correctly', () => {
    expect(parse('0b11')).toBeLexicalInteger(3);
    expect(parse('0B11')).toBeLexicalInteger(3);
    expect(parse('~0b11')).toBeLexicalInteger(-3);
    expect(parse('~0B11')).toBeLexicalInteger(-3);
  });
});

