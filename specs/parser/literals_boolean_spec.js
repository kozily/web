import { parserFor } from '../../app/oz/parser';
import literalsBooleanGrammar from '../../app/oz/grammar/literals_boolean.nearley';

const parse = parserFor(literalsBooleanGrammar);

const customMatchers = {
  toBeLiteralTruthy() {
    return {
      compare(actual) {
        const pass =
          actual.get('node') === 'literal' &&
          actual.get('type') === 'boolean' &&
          actual.get('value') === true;
        return { pass };
      },
    };
  },
  toBeLiteralFalsy() {
    return {
      compare(actual) {
        const pass =
          actual.get('node') === 'literal' &&
          actual.get('type') === 'boolean' &&
          actual.get('value') === false;
        return { pass };
      },
    };
  },
};

describe('Parsing boolean', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

  it('handles true correctly', () => {
    expect(parse('true')).toBeLiteralTruthy();
    expect(parse('true')).not.toBeLiteralFalsy();
  });

  it('handles false correctly', () => {
    expect(parse('false')).toBeLiteralFalsy();
    expect(parse('false')).not.toBeLiteralTruthy();
  });
});
