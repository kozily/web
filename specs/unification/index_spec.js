import Immutable from "immutable";
import { unificators } from "../../app/oz/unification";
import { allValueTypes } from "../../app/oz/machine/values";

describe("Unifying values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has an unificator for all types", () => {
    const typesWithUnificators = Immutable.Set(Object.keys(unificators));
    const types = Immutable.Set(allValueTypes);

    expect(typesWithUnificators).toEqual(types);
  });
});
