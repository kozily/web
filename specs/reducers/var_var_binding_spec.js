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
import reduce from "../../app/oz/reducers/binding";

describe("Reducing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when variables unbound and in different equivalence sets", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
      buildStore(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("x", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("y", 0),
          buildVariable("y", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("z", 0),
          buildVariable("z", 1),
        ),
      ),
    );

    const statement = buildSemanticStatement(
      statements.binding(lexical.variable("X"), lexical.variable("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(buildSemanticStatement(statements.skip())),
        buildStore(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
        ),
      ),
    );
  });

  it("reduces correctly when variables unbound and in the same equivalence sets", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
      buildStore(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("x", 1),
          buildVariable("y", 0),
          buildVariable("y", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("z", 0),
          buildVariable("z", 1),
        ),
      ),
    );

    const statement = buildSemanticStatement(
      statements.binding(lexical.variable("X"), lexical.variable("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(buildSemanticStatement(statements.skip())),
        buildStore(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
        ),
      ),
    );
  });

  it("reduces correctly when variables unbound and in reverse order", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
      buildStore(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("y", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      statements.binding(lexical.variable("Z"), lexical.variable("X")),
      buildEnvironment({
        Z: buildVariable("z", 0),
        X: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(buildSemanticStatement(statements.skip())),
        buildStore(
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("x", 0),
            buildVariable("y", 0),
          ),
        ),
      ),
    );
  });
});
