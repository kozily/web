import parser from '../../app/oz/parser';
import kernelizer from '../../app/oz/kernelizer';
import oz from '../../app/oz/machine';

describe('Executing skip statements', () => {
  it('executes correclty', () => {
    const syntax = parser('skip');
    const kernel = kernelizer(syntax);
    const initialState = oz.build(kernel);

    const result = oz.step(initialState);

    expect(result.get('stack').isEmpty()).toBe(true);
    expect(result.get('store').isEmpty()).toBe(true);
  });
});
