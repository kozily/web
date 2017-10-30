import Immutable from "immutable";
import { skipStatement, localStatement } from "../samples/statements";
import { lexicalVariable, lexicalNumber } from "../samples/lexical";
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
      buildStack(buildSemanticStatement(skipStatement())),
    );

    const statement = buildSemanticStatement(
      localStatement(lexicalVariable("X"), skipStatement()),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ),
        buildStore(buildEquivalenceClass(undefined, buildVariable("x", 0))),
      ),
    );
  });

  it("reduces correctly when there are previous variables in the store", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(skipStatement())),
      buildStore(
        buildEquivalenceClass(lexicalNumber(10), buildVariable("y", 0)),
        buildEquivalenceClass(lexicalNumber(20), buildVariable("x", 0)),
        buildEquivalenceClass(lexicalNumber(30), buildVariable("x", 1)),
      ),
    );
    const statement = buildSemanticStatement(
      localStatement(lexicalVariable("X"), skipStatement()),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              Y: buildVariable("y", 0),
              X: buildVariable("x", 2),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ),

        buildStore(
          buildEquivalenceClass(lexicalNumber(10), buildVariable("y", 0)),
          buildEquivalenceClass(lexicalNumber(20), buildVariable("x", 0)),
          buildEquivalenceClass(lexicalNumber(30), buildVariable("x", 1)),
          buildEquivalenceClass(undefined, buildVariable("x", 2)),
        ),
      ),
    );
  });
});
