import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { literalRecord, literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

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

  it("collects all the nested identifiers in the values", () => {
    const literal = literalRecord("person", {
      age: lexicalIdentifier("A"),
      address: literalRecord("address", {
        number: lexicalIdentifier("N"),
        floor: literalNumber(3),
      }),
    });

    expect(collectFreeIdentifiers(literal)).toEqual(Immutable.Set(["A", "N"]));
  });

  it("collects nested identifiers when the identifier has more than one letter", () => {
    const literal = literalRecord("person", {
      age: lexicalIdentifier("Age"),
    });

    expect(collectFreeIdentifiers(literal)).toEqual(Immutable.Set.of("Age"));
  });
});
