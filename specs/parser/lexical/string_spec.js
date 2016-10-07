import Immutable from 'immutable';
import lexical from '../../samples/lexical';
import { parserFor } from '../../../app/oz/parser';
import lexicalGrammar from '../../../app/oz/grammar/lexical.nearley';

const parse = parserFor(lexicalGrammar);

describe('Parsing lexical string elements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles parsing correctly', () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(lexical.string('a \\\nSTRING'));
  });
});

