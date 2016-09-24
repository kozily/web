import parser from '../../app/oz/parser';
import kernelizer from '../../app/oz/kernelizer.js';
import oz from '../../app/oz/machine';

describe('Executing sequence statements', () => {
  it('executes correclty', () => {
    const syntax = parser('skip skip');
    const kernel = kernelizer(syntax);
    const initialState = oz.build(kernel);

    const result = oz.step(initialState);

    expect(result.get('stack').size).toEqual(2);
    expect(result.getIn(['stack', 0, 'statement', 'node'])).toEqual('statement');
    expect(result.getIn(['stack', 1, 'statement', 'node'])).toEqual('statement');
    expect(result.get('store').isEmpty()).toBe(true);
  });
});
