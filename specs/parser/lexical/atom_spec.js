import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

function makeLexicalAtom(name) {
  return Immutable.fromJS({
    node: 'value',
    type: 'record',
    value: {
      label: name,
      features: {},
    },
  });
}

describe('Parsing lexical atom elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles unquoted atoms correctly', () => {
    expect(parse('a')).toEqual(makeLexicalAtom('a'));
    expect(parse('foo')).toEqual(makeLexicalAtom('foo'));
    expect(parse('a_person')).toEqual(makeLexicalAtom('a_person'));
    expect(parse('donkeyKong3')).toEqual(makeLexicalAtom('donkeyKong3'));
  });

  it('handles quoted atoms correctly', () => {
    expect(parse('\'=\'')).toEqual(makeLexicalAtom('='));
    expect(parse('\':=\'')).toEqual(makeLexicalAtom(':='));
    expect(parse('\'Oz 3.0\'')).toEqual(makeLexicalAtom('Oz 3.0'));
    expect(parse('\'Hello World\'')).toEqual(makeLexicalAtom('Hello World'));
    expect(parse('\'if\'')).toEqual(makeLexicalAtom('if'));
    expect(parse('\'\n,\n \'')).toEqual(makeLexicalAtom('\n,\n '));
    expect(parse('\'#### hello ####\'')).toEqual(makeLexicalAtom('#### hello ####'));
    expect(parse('\'true\'')).toEqual(makeLexicalAtom('true'));
    expect(parse('\'false\'')).toEqual(makeLexicalAtom('false'));
  });

  it('handles special keywords not atoms', () => {
    expect(parse('unit')).not.toEqual(makeLexicalAtom('unit'));
    expect(parse('andthen')).not.toEqual(makeLexicalAtom('andthen'));
  });
});

