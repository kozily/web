import Immutable from "immutable";
import { checkers } from "../../app/oz/entailment";
import { allValueTypes } from "../../app/oz/machine/values";

describe("Entailing values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a checker for all types", () => {
    const typesWithCheckers = Immutable.Set(Object.keys(checkers));
    const types = Immutable.Set(allValueTypes);

    expect(typesWithCheckers).toEqual(types);
  });
});
