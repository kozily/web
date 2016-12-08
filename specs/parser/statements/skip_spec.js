import Immutable from 'immutable';
import statements from '../../samples/statements';
import parse from '../../../app/oz/parser';

describe('Parsing skip statements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles it correctly', () => {
    expect(parse('skip')).toEqual(statements.skip());
  });
});

