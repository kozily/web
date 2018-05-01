import Immutable from "immutable";
import { skipStatement } from "../../../app/oz/machine/statements";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";

describe("Reducing skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("executes correctly", () => {
    const state = buildSingleThreadedState();
    const statement = buildSemanticStatement(skipStatement());

    expect(execute(state, statement)).toEqual(buildSingleThreadedState());
  });

  it("executes keeping the environment index", () => {
    const state = buildSingleThreadedState();
    const statement = buildSemanticStatement(
      skipStatement(),
      buildEnvironment(),
      { environmentIndex: 0 },
    );

    expect(execute(state, statement)).toEqual(buildSingleThreadedState());
  });
});
