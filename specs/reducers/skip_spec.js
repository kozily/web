import Immutable from 'immutable';
import statements from '../samples/statements';
import machine from '../../app/oz/machine';
import reduce from '../../app/oz/reducers/skip';

describe('Reducing skip statements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('reduces correclty', () => {
    const state = machine.build.state(
      machine.build.stack(
        machine.build.semanticStatement(statements.skip())
      )
    );
    const statement = machine.build.semanticStatement(
      statements.skip()
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(
          machine.build.semanticStatement(statements.skip()),
        )
      )
    );
  });
});
