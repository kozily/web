import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { literalRecord } from "../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a record literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all the identifiers in the record", () => {
    const literal = literalRecord("person", {
      age: lexicalIdentifier("A"),
      name: lexicalIdentifier("N"),
    });

    expect(collectFreeIdentifiers(literal)).toEqual(Immutable.Set(["A", "N"]));
  });
});
