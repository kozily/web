import Immutable from "immutable";
import { valueCreators } from "../../app/oz/value_creation";
import { allValueTypes } from "../../app/oz/machine/values";

describe("Creating values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a value creator for all types", () => {
    const typesWithValueCreators = Immutable.Set(Object.keys(valueCreators));
    const types = Immutable.Set(allValueTypes);

    expect(typesWithValueCreators).toEqual(types);
  });
});
