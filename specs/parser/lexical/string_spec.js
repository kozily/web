import Immutable from 'immutable';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

function makeLexicalString(value) {
  if (value === '') {
    return Immutable.fromJS({
      node: 'value',
      type: 'record',
      value: {
        label: 'nil',
        features: {},
      },
    });
  }

  return Immutable.fromJS({
    node: 'value',
    type: 'record',
    value: {
      label: '|',
      features: {
        1: value.charCodeAt(0),
        2: makeLexicalString(value.substring(1)),
      },
    },
  });
}

describe('Parsing lexical string elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles parsing correctly', () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(makeLexicalString('a \\\nSTRING'));
  });
});

