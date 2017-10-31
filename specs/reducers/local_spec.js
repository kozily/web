import Immutable from "immutable";
import statements from "../samples/statements";
import lexical from "../samples/lexical";
import machine from "../../app/oz/machine";
import reduce from "../../app/oz/reducers/local";

describe("Reducing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when the store is empty", () => {
    const state = machine.build.state(
      machine.build.stack(machine.build.semanticStatement(statements.skip())),
    );

    const statement = machine.build.semanticStatement(
      statements.local(lexical.variable("X"), statements.skip()),
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(
          machine.build.semanticStatement(
            statements.skip(),
            machine.build.environment({
              X: machine.build.variable("x", 0),
            }),
          ),
          machine.build.semanticStatement(statements.skip()),
        ),
        machine.build.store(
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("x", 0),
          ),
        ),
      ),
    );
  });

  it("reduces correctly when there are previous variables in the store", () => {
    const state = machine.build.state(
      machine.build.stack(machine.build.semanticStatement(statements.skip())),
      machine.build.store(
        machine.build.equivalenceClass(
          lexical.number(10),
          machine.build.variable("y", 0),
        ),
        machine.build.equivalenceClass(
          lexical.number(20),
          machine.build.variable("x", 0),
        ),
        machine.build.equivalenceClass(
          lexical.number(30),
          machine.build.variable("x", 1),
        ),
      ),
    );
    const statement = machine.build.semanticStatement(
      statements.local(lexical.variable("X"), statements.skip()),
      machine.build.environment({
        Y: machine.build.variable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      machine.build.state(
        machine.build.stack(
          machine.build.semanticStatement(
            statements.skip(),
            machine.build.environment({
              Y: machine.build.variable("y", 0),
              X: machine.build.variable("x", 2),
            }),
          ),
          machine.build.semanticStatement(statements.skip()),
        ),

        machine.build.store(
          machine.build.equivalenceClass(
            lexical.number(10),
            machine.build.variable("y", 0),
          ),
          machine.build.equivalenceClass(
            lexical.number(20),
            machine.build.variable("x", 0),
          ),
          machine.build.equivalenceClass(
            lexical.number(30),
            machine.build.variable("x", 1),
          ),
          machine.build.equivalenceClass(
            undefined,
            machine.build.variable("x", 2),
          ),
        ),
      ),
    );
  });
});
