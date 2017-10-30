import Immutable from "immutable";
import statements from "../samples/statements";
import lexical from "../samples/lexical";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
  buildStore,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/reducers/local";

describe("Reducing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when the store is empty", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
    );

    const statement = buildSemanticStatement(
      statements.local(lexical.variable("X"), statements.skip()),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            statements.skip(),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(statements.skip()),
        ),
        buildStore(buildEquivalenceClass(undefined, buildVariable("x", 0))),
      ),
    );
  });

  it("reduces correctly when there are previous variables in the store", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
      buildStore(
        buildEquivalenceClass(lexical.number(10), buildVariable("y", 0)),
        buildEquivalenceClass(lexical.number(20), buildVariable("x", 0)),
        buildEquivalenceClass(lexical.number(30), buildVariable("x", 1)),
      ),
    );
    const statement = buildSemanticStatement(
      statements.local(lexical.variable("X"), statements.skip()),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            statements.skip(),
            buildEnvironment({
              Y: buildVariable("y", 0),
              X: buildVariable("x", 2),
            }),
          ),
          buildSemanticStatement(statements.skip()),
        ),

        buildStore(
          buildEquivalenceClass(lexical.number(10), buildVariable("y", 0)),
          buildEquivalenceClass(lexical.number(20), buildVariable("x", 0)),
          buildEquivalenceClass(lexical.number(30), buildVariable("x", 1)),
          buildEquivalenceClass(undefined, buildVariable("x", 2)),
        ),
      ),
    );
  });
});
