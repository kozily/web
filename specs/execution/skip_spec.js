import Immutable from "immutable";
import { skipStatement } from "../samples/statements";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/skip";

describe("Reducing skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correclty", () => {
    const state = buildState(
      buildStack(buildSemanticStatement(skipStatement())),
    );
    const statement = buildSemanticStatement(skipStatement());

    expect(reduce(state, statement)).toEqual(
      buildState(buildStack(buildSemanticStatement(skipStatement()))),
    );
  });
});
