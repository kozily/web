import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

function makeLexicalBoolean(value) {
  return Immutable.fromJS({
    node: 'value',
    type: 'record',
    value: {
      label: value.toString(),
      features: {},
    },
  });
}

describe('Parsing lexical boolean elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles true correctly', () => {
    expect(parse('true')).toEqual(makeLexicalBoolean(true));
  });

  it('handles false correctly', () => {
    expect(parse('false')).toEqual(makeLexicalBoolean(false));
  });
});
