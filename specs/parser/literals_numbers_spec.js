import { parserFor } from '../../app/oz/parser';
import literalsNumbersGrammar from '../../app/oz/grammar/literals_numbers.nearley';

const parse = parserFor(literalsNumbersGrammar);

const customMatchers = {
  toBeLiteralNumber() {
    return {
      compare(actual, expected) {
        const pass =
          actual.get('node') === 'literal' &&
          actual.get('type') === 'number' &&
          actual.get('value') === expected;
        return { pass };
      },
    };
  },
};

describe('Parsing numbers', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles decimal integers correctly', () => {
    expect(parse('1986')).toBeLiteralNumber(1986);
    expect(parse('~1986')).toBeLiteralNumber(-1986);
  });

  it('handles octal integers correctly', () => {
    expect(parse('011')).toBeLiteralNumber(9);
    expect(parse('~011')).toBeLiteralNumber(-9);
  });

  it('handles hexal integers correctly', () => {
    expect(parse('0x11')).toBeLiteralNumber(17);
    expect(parse('0X11')).toBeLiteralNumber(17);
    expect(parse('~0x11')).toBeLiteralNumber(-17);
    expect(parse('~0X11')).toBeLiteralNumber(-17);
  });

  it('handles binary integers correctly', () => {
    expect(parse('0b11')).toBeLiteralNumber(3);
    expect(parse('0B11')).toBeLiteralNumber(3);
    expect(parse('~0b11')).toBeLiteralNumber(-3);
    expect(parse('~0B11')).toBeLiteralNumber(-3);
  });

  it('handles floats correctly', () => {
    expect(parse('12.')).toBeLiteralNumber(12.0);
    expect(parse('12.34')).toBeLiteralNumber(12.34);
    expect(parse('~12.34')).toBeLiteralNumber(-12.34);
    expect(parse('12.e1')).toBeLiteralNumber(120);
    expect(parse('1.54045e2')).toBeLiteralNumber(154.045);
    expect(parse('12.e~1')).toBeLiteralNumber(1.2);
    expect(parse('~1.54045e2')).toBeLiteralNumber(-154.045);
    expect(parse('1.54045e~2')).toBeLiteralNumber(0.0154045);
    expect(parse('~1.54045e~2')).toBeLiteralNumber(-0.0154045);
    expect(parse('1.54045E2')).toBeLiteralNumber(154.045);
    expect(parse('~1.54045E2')).toBeLiteralNumber(-154.045);
    expect(parse('1.54045E~2')).toBeLiteralNumber(0.0154045);
    expect(parse('~1.54045E~2')).toBeLiteralNumber(-0.0154045);
  });

  it('handles explicit characters correctly', () => {
    expect(parse('&a')).toBeLiteralNumber('a'.charCodeAt(0));
    expect(parse('& ')).toBeLiteralNumber(' '.charCodeAt(0));
  });

  it('handles octal characters correctly', () => {
    expect(parse('&\\101')).toBeLiteralNumber(65);
  });

  it('handles hexal characters correctly', () => {
    expect(parse('&\\xff')).toBeLiteralNumber(255);
    expect(parse('&\\X0A')).toBeLiteralNumber(10);
    expect(parse('&\\XfA')).toBeLiteralNumber(250);
  });

  it('handles escaped character correctly', () => {
    expect(parse('&\\a')).toBeLiteralNumber(7);
    expect(parse('&\\b')).toBeLiteralNumber(8);
    expect(parse('&\\f')).toBeLiteralNumber(12);
    expect(parse('&\\n')).toBeLiteralNumber(10);
    expect(parse('&\\r')).toBeLiteralNumber(13);
    expect(parse('&\\t')).toBeLiteralNumber(9);
    expect(parse('&\\v')).toBeLiteralNumber(11);
    expect(parse('&\\\\')).toBeLiteralNumber(92);
    expect(parse('&\\’')).toBeLiteralNumber(39);
    expect(parse('&\\"')).toBeLiteralNumber(34);
    expect(parse('&\\`')).toBeLiteralNumber(96);
    expect(parse('&\\&')).toBeLiteralNumber(38);
  });
});
