import parseOz from '../../app/oz/parser';

describe('Number parsing', () => {
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

  it('handles floats correctly', () => {
    expect(parseOz('12.')).toBeLiteralNumber(12.0);
    expect(parseOz('12.34')).toBeLiteralNumber(12.34);
    expect(parseOz('~12.34')).toBeLiteralNumber(-12.34);
    expect(parseOz('12.e1')).toBeLiteralNumber(120);
    expect(parseOz('1.54045e2')).toBeLiteralNumber(154.045);
    expect(parseOz('12.e~1')).toBeLiteralNumber(1.2);
    expect(parseOz('~1.54045e2')).toBeLiteralNumber(-154.045);
    expect(parseOz('1.54045e~2')).toBeLiteralNumber(0.0154045);
    expect(parseOz('~1.54045e~2')).toBeLiteralNumber(-0.0154045);
    expect(parseOz('1.54045E2')).toBeLiteralNumber(154.045);
    expect(parseOz('~1.54045E2')).toBeLiteralNumber(-154.045);
    expect(parseOz('1.54045E~2')).toBeLiteralNumber(0.0154045);
    expect(parseOz('~1.54045E~2')).toBeLiteralNumber(-0.0154045);
  });

  it('handles characters correctly', () => {
    expect(parseOz('&a')).toBeLiteralNumber('a'.charCodeAt(0));
    expect(parseOz('& ')).toBeLiteralNumber(' '.charCodeAt(0));
    expect(parseOz('&\\101')).toBeLiteralNumber(65);
    expect(parseOz('&\\xff')).toBeLiteralNumber(255);
    expect(parseOz('&\\X0A')).toBeLiteralNumber(10);
    expect(parseOz('&\\XfA')).toBeLiteralNumber(250);
    expect(parseOz('&\\a')).toBeLiteralNumber(7);
    expect(parseOz('&\\b')).toBeLiteralNumber(8);
    expect(parseOz('&\\f')).toBeLiteralNumber(12);
    expect(parseOz('&\\n')).toBeLiteralNumber(10);
    expect(parseOz('&\\r')).toBeLiteralNumber(13);
    expect(parseOz('&\\t')).toBeLiteralNumber(9);
    expect(parseOz('&\\v')).toBeLiteralNumber(11);
    expect(parseOz('&\\\\')).toBeLiteralNumber(92);
    expect(parseOz('&\\’')).toBeLiteralNumber(39);
    expect(parseOz('&\\"')).toBeLiteralNumber(34);
    expect(parseOz('&\\`')).toBeLiteralNumber(96);
    expect(parseOz('&\\&')).toBeLiteralNumber(38);
  });
});
