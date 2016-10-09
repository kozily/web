import parse from '../../app/oz/parser';

describe('Parsing whitespace around statements', () => {
  it('handles it correctly', () => {
    const result = parse('  skip ');
    expect(result.get('node')).toEqual('statement');
    expect(result.get('statement')).toEqual('skip');
  });
});

