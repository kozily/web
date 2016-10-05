import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

function makeLexicalNumber(value) {
  return Immutable.fromJS({
    node: 'value',
    type: 'number',
    value,
  });
}

describe('Parsing lexical char elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles numeric characters correclty', () => {
    expect(parse('40')).toEqual(makeLexicalNumber(40));
    expect(parse('255')).toEqual(makeLexicalNumber(255));
  });

  it('handles explicit characters correctly', () => {
    expect(parse('&a')).toEqual(makeLexicalNumber('a'.charCodeAt(0)));
    expect(parse('& ')).toEqual(makeLexicalNumber(' '.charCodeAt(0)));
  });

  it('handles octal characters correctly', () => {
    expect(parse('&\\101')).toEqual(makeLexicalNumber(65));
  });

  it('handles hexal characters correctly', () => {
    expect(parse('&\\xff')).toEqual(makeLexicalNumber(255));
    expect(parse('&\\X0A')).toEqual(makeLexicalNumber(10));
    expect(parse('&\\XfA')).toEqual(makeLexicalNumber(250));
  });

  it('handles escaped character correctly', () => {
    expect(parse('&\\a')).toEqual(makeLexicalNumber(7));
    expect(parse('&\\b')).toEqual(makeLexicalNumber(8));
    expect(parse('&\\f')).toEqual(makeLexicalNumber(12));
    expect(parse('&\\n')).toEqual(makeLexicalNumber(10));
    expect(parse('&\\r')).toEqual(makeLexicalNumber(13));
    expect(parse('&\\t')).toEqual(makeLexicalNumber(9));
    expect(parse('&\\v')).toEqual(makeLexicalNumber(11));
    expect(parse('&\\\\')).toEqual(makeLexicalNumber(92));
    expect(parse('&\\\'')).toEqual(makeLexicalNumber(39));
    expect(parse('&\\"')).toEqual(makeLexicalNumber(34));
    expect(parse('&\\`')).toEqual(makeLexicalNumber(96));
    expect(parse('&\\&')).toEqual(makeLexicalNumber(38));
  });
});

