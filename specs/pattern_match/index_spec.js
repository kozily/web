import Immutable from "immutable";
import { matchers } from "../../app/oz/pattern_match";
import { allPatternTypes } from "../../app/oz/machine/patterns";

describe("Matching values against patterns", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a matchers for all types", () => {
    const includedTypes = Immutable.Set(Object.keys(matchers));
    const types = Immutable.Set(allPatternTypes);

    expect(includedTypes).toEqual(types);
  });
});
