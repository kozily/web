import Immutable from 'immutable';
import statements from '../../samples/statements';
import parse from '../../../app/oz/parser';

describe('Parsing sequence statements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('handles a single space between statements correctly', () => {
    expect(parse('skip skip'))
      .toEqual(
        statements.sequence(
          statements.skip(),
          statements.skip()
        )
      );
  });

  it('handles multiple whitespace characters correctly', () => {
    expect(parse('skip\n\t  skip'))
      .toEqual(
        statements.sequence(
          statements.skip(),
          statements.skip()
        )
      );
  });

  it('handles multiple nested sequences correctly', () => {
    expect(parse('skip skip skip'))
      .toEqual(
        statements.sequence(
          statements.skip(),
          statements.sequence(
            statements.skip(),
            statements.skip()
          )
        )
      );
  });
});

