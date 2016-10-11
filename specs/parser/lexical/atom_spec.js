import Immutable from 'immutable';
import lexical from '../../samples/lexical';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lexical atom elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles unquoted atoms correctly', () => {
    expect(parse('a')).toEqual(lexical.atom('a'));
    expect(parse('foo')).toEqual(lexical.atom('foo'));
    expect(parse('a_person')).toEqual(lexical.atom('a_person'));
    expect(parse('donkeyKong3')).toEqual(lexical.atom('donkeyKong3'));
  });

  it('handles quoted atoms correctly', () => {
    expect(parse('\'=\'')).toEqual(lexical.atom('='));
    expect(parse('\':=\'')).toEqual(lexical.atom(':='));
    expect(parse('\'Oz 3.0\'')).toEqual(lexical.atom('Oz 3.0'));
    expect(parse('\'Hello World\'')).toEqual(lexical.atom('Hello World'));
    expect(parse('\'if\'')).toEqual(lexical.atom('if'));
    expect(parse('\'\n,\n \'')).toEqual(lexical.atom('\n,\n '));
    expect(parse('\'#### hello ####\'')).toEqual(lexical.atom('#### hello ####'));
    expect(parse('\'true\'')).toEqual(lexical.atom('true'));
    expect(parse('\'false\'')).toEqual(lexical.atom('false'));
  });

  it('handles special keywords not atoms', () => {
    expect(parse('unit')).not.toEqual(lexical.atom('unit'));
    expect(parse('andthen')).not.toEqual(lexical.atom('andthen'));
  });
});

