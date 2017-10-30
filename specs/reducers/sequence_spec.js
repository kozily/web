import Immutable from "immutable";
import statements from "../samples/statements";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/reducers/sequence";

describe("Reducing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
    );
    const statement = buildSemanticStatement(
      statements.sequence(statements.skip(), statements.skip()),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(statements.skip()),
          buildSemanticStatement(statements.skip()),
          buildSemanticStatement(statements.skip()),
        ),
      ),
    );
  });
});
