import { parserFor } from '../../app/oz/parser';
import ozGrammar from '../../app/oz/grammar/index.nearley';

const parse = parserFor(ozGrammar);

describe('Parsing empty statements', () => {
  it('handles it correctly', () => {
    const result = parse('skip');
    expect(result.get('node')).toEqual('statement');
    expect(result.get('statement')).toEqual('skip');
  });
});

