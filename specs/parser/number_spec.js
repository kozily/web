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
});
