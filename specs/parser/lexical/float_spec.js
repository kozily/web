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

describe('Parsing lexical float elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles floats correctly', () => {
    expect(parse('12.')).toEqual(makeLexicalNumber(12.0));
    expect(parse('12.34')).toEqual(makeLexicalNumber(12.34));
    expect(parse('~12.34')).toEqual(makeLexicalNumber(-12.34));
    expect(parse('12.e1')).toEqual(makeLexicalNumber(120));
    expect(parse('1.54045e2')).toEqual(makeLexicalNumber(154.045));
    expect(parse('12.e~1')).toEqual(makeLexicalNumber(1.2));
    expect(parse('~1.54045e2')).toEqual(makeLexicalNumber(-154.045));
    expect(parse('1.54045e~2')).toEqual(makeLexicalNumber(0.0154045));
    expect(parse('~1.54045e~2')).toEqual(makeLexicalNumber(-0.0154045));
    expect(parse('1.54045E2')).toEqual(makeLexicalNumber(154.045));
    expect(parse('~1.54045E2')).toEqual(makeLexicalNumber(-154.045));
    expect(parse('1.54045E~2')).toEqual(makeLexicalNumber(0.0154045));
    expect(parse('~1.54045E~2')).toEqual(makeLexicalNumber(-0.0154045));
  });
});

