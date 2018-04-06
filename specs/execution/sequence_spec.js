import Immutable from "immutable";
import {
  sequenceStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import {
  buildSingleThreadedState,
  buildEnvironment,
  buildSemanticStatement,
  buildVariable,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/sequence";

describe("Reducing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildSingleThreadedState({});

    const sharedEnvironment = buildEnvironment({
      X: buildVariable("x", 0),
    });

    const statement = buildSemanticStatement(
      sequenceStatement(skipStatement(), skipStatement()),
      sharedEnvironment,
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(skipStatement(), sharedEnvironment),
          buildSemanticStatement(skipStatement(), sharedEnvironment),
        ],
      }),
    );
  });
});
