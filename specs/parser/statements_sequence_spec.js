import { parserFor } from '../../app/oz/parser';
import ozGrammar from '../../app/oz/grammar/index.nearley';

const parse = parserFor(ozGrammar);

describe('Parsing statement sequences', () => {
  it('handles a single space correctly', () => {
    const result = parse('skip skip');
    expect(result.get('node')).toEqual('statement');
    expect(result.get('statement')).toEqual('sequence');
    expect(result.getIn(['head', 'node'])).toEqual('statement');
    expect(result.getIn(['head', 'statement'])).toEqual('skip');
    expect(result.getIn(['tail', 'node'])).toEqual('statement');
    expect(result.getIn(['tail', 'statement'])).toEqual('skip');
  });

  it('handles multiple whitespaces correctly', () => {
    const result = parse('skip\n\t  skip');
    expect(result.get('node')).toEqual('statement');
    expect(result.get('statement')).toEqual('sequence');
    expect(result.getIn(['head', 'node'])).toEqual('statement');
    expect(result.getIn(['head', 'statement'])).toEqual('skip');
    expect(result.getIn(['tail', 'node'])).toEqual('statement');
    expect(result.getIn(['tail', 'statement'])).toEqual('skip');
  });

  it('handles multiple nested sequences correctly', () => {
    const result = parse('skip skip skip');
    expect(result.get('node')).toEqual('statement');
    expect(result.get('statement')).toEqual('sequence');
    expect(result.getIn(['head', 'node'])).toEqual('statement');
    expect(result.getIn(['head', 'statement'])).toEqual('skip');
    expect(result.getIn(['tail', 'node'])).toEqual('statement');
    expect(result.getIn(['tail', 'statement'])).toEqual('sequence');
    expect(result.getIn(['tail', 'head', 'node'])).toEqual('statement');
    expect(result.getIn(['tail', 'head', 'statement'])).toEqual('skip');
    expect(result.getIn(['tail', 'tail', 'node'])).toEqual('statement');
    expect(result.getIn(['tail', 'tail', 'statement'])).toEqual('skip');
  });
});

