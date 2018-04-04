import Immutable from "immutable";
import { skipStatement } from "../../app/oz/machine/statements";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/skip";

describe("Reducing skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildSingleThreadedState();
    const statement = buildSemanticStatement(skipStatement());

    expect(reduce(state, statement)).toEqual(buildSingleThreadedState());
  });
});
