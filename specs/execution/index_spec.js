import Immutable from "immutable";
import { executors } from "../../app/oz/execution";
import { allStatementTypes } from "../../app/oz/machine/statements";

describe("Executing statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has an executor for all statement types", () => {
    const typesWithReducers = Immutable.Set(Object.keys(executors.statement));
    const types = Immutable.Set(allStatementTypes);

    expect(typesWithReducers).toEqual(types);
  });
});
