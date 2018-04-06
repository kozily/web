import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  patternMatchingStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalRecord } from "../../app/oz/machine/literals";

describe("Collecting free identifiers in a pattern matching statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the appropriate identifiers", () => {
    const statement = patternMatchingStatement(
      lexicalIdentifier("X"),
      literalRecord("person", {
        age: lexicalIdentifier("A"),
        name: lexicalIdentifier("N"),
      }),
      bindingStatement(lexicalIdentifier("Y"), lexicalIdentifier("A")),
      bindingStatement(lexicalIdentifier("Z"), lexicalIdentifier("N")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y", "Z", "N"]),
    );
  });
});
