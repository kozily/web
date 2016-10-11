import Immutable from 'immutable';
import lexical from '../../samples/lexical';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lexical variable elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles unquoted variables correctly', () => {
    expect(parse('X')).toEqual(lexical.variable('X'));
    expect(parse('OneVariable')).toEqual(lexical.variable('OneVariable'));
  });

  it('handles quoted variables correctly', () => {
    expect(parse('`One Variable`')).toEqual(lexical.variable('One Variable'));
    expect(parse('`One\\\\Variable`')).toEqual(lexical.variable('One\\Variable'));
  });
});

