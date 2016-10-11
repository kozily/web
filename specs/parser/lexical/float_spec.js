import Immutable from 'immutable';
import lexical from '../../samples/lexical';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lexical float elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles floats correctly', () => {
    expect(parse('12.')).toEqual(lexical.number(12.0));
    expect(parse('12.34')).toEqual(lexical.number(12.34));
    expect(parse('~12.34')).toEqual(lexical.number(-12.34));
    expect(parse('12.e1')).toEqual(lexical.number(120));
    expect(parse('1.54045e2')).toEqual(lexical.number(154.045));
    expect(parse('12.e~1')).toEqual(lexical.number(1.2));
    expect(parse('~1.54045e2')).toEqual(lexical.number(-154.045));
    expect(parse('1.54045e~2')).toEqual(lexical.number(0.0154045));
    expect(parse('~1.54045e~2')).toEqual(lexical.number(-0.0154045));
    expect(parse('1.54045E2')).toEqual(lexical.number(154.045));
    expect(parse('~1.54045E2')).toEqual(lexical.number(-154.045));
    expect(parse('1.54045E~2')).toEqual(lexical.number(0.0154045));
    expect(parse('~1.54045E~2')).toEqual(lexical.number(-0.0154045));
  });
});

