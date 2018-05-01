import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { literalNumber } from "../../../app/oz/machine/literals";

describe("Collecting free identifiers in a number literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("always returns an empty set", () => {
    const literal = literalNumber(3);
    expect(collectFreeIdentifiers(literal)).toEqual(Immutable.Set());
  });
});
