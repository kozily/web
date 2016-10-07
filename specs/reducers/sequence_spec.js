import Immutable from 'immutable';
import statements from '../samples/statements';
import machine from '../../app/oz/machine';
import reduce from '../../app/oz/reducers/sequence';

describe('Reducing sequence statements', () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it('reduces correctly', () => {
    const state = machine.build.state(
      machine.build.stack(
        machine.build.semanticStatement(statements.skip())
      )
    );
    const statement = machine.build.semanticStatement(
      statements.sequence(statements.skip(), statements.skip())
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(
          machine.build.semanticStatement(statements.skip()),
          machine.build.semanticStatement(statements.skip()),
          machine.build.semanticStatement(statements.skip()),
        )
      )
    );
  });
});

