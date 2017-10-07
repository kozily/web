import Immutable from "immutable";
import statements from "../samples/statements";
import lexical from "../samples/lexical";
import machine from "../../app/oz/machine";
import reduce from "../../app/oz/reducers/binding";

describe("Reducing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when variables unbound and in different equivalence sets", () => {
    const state = machine.build.state(
      machine.build.stack(machine.build.semanticStatement(statements.skip())),
      machine.build.store(
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("x", 0),
          machine.build.variable("x", 1),
        ),
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("y", 0),
          machine.build.variable("y", 1),
        ),
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("z", 0),
          machine.build.variable("z", 1),
        ),
      ),
    );

    const statement = machine.build.semanticStatement(
      statements.binding(lexical.variable("X"), lexical.variable("Y")),
      machine.build.environment({
        X: machine.build.variable("x", 0),
        Y: machine.build.variable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(machine.build.semanticStatement(statements.skip())),
        machine.build.store(
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("x", 0),
            machine.build.variable("x", 1),
            machine.build.variable("y", 0),
            machine.build.variable("y", 1),
          ),
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("z", 0),
            machine.build.variable("z", 1),
          ),
        ),
      ),
    );
  });

  it("reduces correctly when variables unbound and in the same equivalence sets", () => {
    const state = machine.build.state(
      machine.build.stack(machine.build.semanticStatement(statements.skip())),
      machine.build.store(
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("x", 0),
          machine.build.variable("x", 1),
          machine.build.variable("y", 0),
          machine.build.variable("y", 1),
        ),
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("z", 0),
          machine.build.variable("z", 1),
        ),
      ),
    );

    const statement = machine.build.semanticStatement(
      statements.binding(lexical.variable("X"), lexical.variable("Y")),
      machine.build.environment({
        X: machine.build.variable("x", 0),
        Y: machine.build.variable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(machine.build.semanticStatement(statements.skip())),
        machine.build.store(
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("x", 0),
            machine.build.variable("x", 1),
            machine.build.variable("y", 0),
            machine.build.variable("y", 1),
          ),
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("z", 0),
            machine.build.variable("z", 1),
          ),
        ),
      ),
    );
  });

  it("reduces correctly when variables unbound and in reverse order", () => {
    const state = machine.build.state(
      machine.build.stack(machine.build.semanticStatement(statements.skip())),
      machine.build.store(
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("x", 0),
          machine.build.variable("y", 0),
        ),
        machine.build.equivalenceClass(
          undefined,
          machine.build.variable("z", 0),
        ),
      ),
    );

    const statement = machine.build.semanticStatement(
      statements.binding(lexical.variable("Z"), lexical.variable("X")),
      machine.build.environment({
        Z: machine.build.variable("z", 0),
        X: machine.build.variable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(machine.build.semanticStatement(statements.skip())),
        machine.build.store(
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("z", 0),
            machine.build.variable("x", 0),
            machine.build.variable("y", 0),
          ),
        ),
      ),
    );
  });
});
