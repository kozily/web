import Immutable from "immutable";
import { sequenceStatement, skipStatement } from "../samples/statements";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/sequence";

describe("Reducing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(skipStatement())),
    );
    const statement = buildSemanticStatement(
      sequenceStatement(skipStatement(), skipStatement()),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(skipStatement()),
          buildSemanticStatement(skipStatement()),
          buildSemanticStatement(skipStatement()),
        ),
      ),
    );
  });
});
