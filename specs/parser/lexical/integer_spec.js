import Immutable from 'immutable';
import lexical from '../../samples/lexical';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lexical integer elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles decimal integers correctly', () => {
    expect(parse('1986')).toEqual(lexical.number(1986));
    expect(parse('~1986')).toEqual(lexical.number(-1986));
  });

  it('handles octal integers correctly', () => {
    expect(parse('011')).toEqual(lexical.number(9));
    expect(parse('~011')).toEqual(lexical.number(-9));
  });

  it('handles hexal integers correctly', () => {
    expect(parse('0x11')).toEqual(lexical.number(17));
    expect(parse('0X11')).toEqual(lexical.number(17));
    expect(parse('~0x11')).toEqual(lexical.number(-17));
    expect(parse('~0X11')).toEqual(lexical.number(-17));
  });

  it('handles binary integers correctly', () => {
    expect(parse('0b11')).toEqual(lexical.number(3));
    expect(parse('0B11')).toEqual(lexical.number(3));
    expect(parse('~0b11')).toEqual(lexical.number(-3));
    expect(parse('~0B11')).toEqual(lexical.number(-3));
  });
});

