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

describe('Parsing lexical integer elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles decimal integers correctly', () => {
    expect(parse('1986')).toEqual(makeLexicalNumber(1986));
    expect(parse('~1986')).toEqual(makeLexicalNumber(-1986));
  });

  it('handles octal integers correctly', () => {
    expect(parse('011')).toEqual(makeLexicalNumber(9));
    expect(parse('~011')).toEqual(makeLexicalNumber(-9));
  });

  it('handles hexal integers correctly', () => {
    expect(parse('0x11')).toEqual(makeLexicalNumber(17));
    expect(parse('0X11')).toEqual(makeLexicalNumber(17));
    expect(parse('~0x11')).toEqual(makeLexicalNumber(-17));
    expect(parse('~0X11')).toEqual(makeLexicalNumber(-17));
  });

  it('handles binary integers correctly', () => {
    expect(parse('0b11')).toEqual(makeLexicalNumber(3));
    expect(parse('0B11')).toEqual(makeLexicalNumber(3));
    expect(parse('~0b11')).toEqual(makeLexicalNumber(-3));
    expect(parse('~0B11')).toEqual(makeLexicalNumber(-3));
  });
});

