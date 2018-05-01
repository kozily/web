import Immutable from "immutable";
import { valueCreators } from "../../app/oz/value_creation";
import { kernelLiteralTypes } from "../../app/oz/machine/literals";

const allLiteralTypes = Object.keys(kernelLiteralTypes);

describe("Creating values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a value creator for all types", () => {
    const typesWithValueCreators = Immutable.Set(Object.keys(valueCreators));
    const types = Immutable.Set(allLiteralTypes);

    expect(typesWithValueCreators).toEqual(types);
  });
});
