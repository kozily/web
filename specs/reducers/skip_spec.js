import Immutable from "immutable";
import statements from "../samples/statements";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/reducers/skip";

describe("Reducing skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correclty", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(statements.skip())),
    );
    const statement = buildSemanticStatement(statements.skip());

    expect(reduce(state, statement)).toEqual(
      buildState(buildStack(buildSemanticStatement(statements.skip()))),
    );
  });
});
