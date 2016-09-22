import parseOz from '../../app/oz/parser';

describe('Integer parsing', () => {
  beforeEach(() => {
    jasmine.addMatchers({
      toBeLiteralNumber() {
        return {
          compare(actual, expected) {
            return {
              pass: actual.length === 1 &&
              actual[0].node === 'literal' &&
              actual[0].type === 'number' &&
              actual[0].value === expected,
            };
          },
        };
      },
    });
  });

  it('handles decimal integers correctly', () => {
    expect(parseOz('1986')).toBeLiteralNumber(1986);
    expect(parseOz('~1986')).toBeLiteralNumber(-1986);
  });

  it('handles octal integers correctly', () => {
    expect(parseOz('011')).toBeLiteralNumber(9);
    expect(parseOz('~011')).toBeLiteralNumber(-9);
  });

  it('handles hexal integers correctly', () => {
    expect(parseOz('0x11')).toBeLiteralNumber(17);
    expect(parseOz('0X11')).toBeLiteralNumber(17);
    expect(parseOz('~0x11')).toBeLiteralNumber(-17);
    expect(parseOz('~0X11')).toBeLiteralNumber(-17);
  });

  it('handles binary integers correctly', () => {
    expect(parseOz('0b11')).toBeLiteralNumber(3);
    expect(parseOz('0B11')).toBeLiteralNumber(3);
    expect(parseOz('~0b11')).toBeLiteralNumber(-3);
    expect(parseOz('~0B11')).toBeLiteralNumber(-3);
  });
});
