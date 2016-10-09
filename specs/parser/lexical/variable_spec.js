import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

function makeLexicalVariable(identifier) {
  return Immutable.fromJS({
    node: 'variable',
    identifier,
  });
}

describe('Parsing lexical variable elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles unquoted variables correctly', () => {
    expect(parse('X')).toEqual(makeLexicalVariable('X'));
    expect(parse('OneVariable')).toEqual(makeLexicalVariable('OneVariable'));
  });

  it('handles quoted variables correctly', () => {
    expect(parse('`One Variable`')).toEqual(makeLexicalVariable('One Variable'));
    expect(parse('`One\\\\Variable`')).toEqual(makeLexicalVariable('One\\Variable'));
  });
});

