import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  exceptionContextStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a try statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects identifiers from substatements, except for the exception identifier", () => {
    const statement = exceptionContextStatement(
      bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
      lexicalIdentifier("X"),
      bindingStatement(lexicalIdentifier("C"), lexicalIdentifier("X")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["A", "B", "C"]),
    );
  });

  it("collects identifiers from substatements including the exception identifier if it is also used in the tried statement", () => {
    const statement = exceptionContextStatement(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("B")),
      lexicalIdentifier("X"),
      bindingStatement(lexicalIdentifier("C"), lexicalIdentifier("X")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "B", "C"]),
    );
  });
});
