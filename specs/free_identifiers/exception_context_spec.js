import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  exceptionContextStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Collecting free identifiers in a try statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects identifiers from substatements, except for the exception identifier", () => {
    const statement = exceptionContextStatement(
      bindingStatement(
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
      ),
      lexicalIdentifier("X"),
      bindingStatement(
        identifierExpression(lexicalIdentifier("C")),
        identifierExpression(lexicalIdentifier("X")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["A", "B", "C"]),
    );
  });

  it("collects identifiers from substatements including the exception identifier if it is also used in the tried statement", () => {
    const statement = exceptionContextStatement(
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("B")),
      ),
      lexicalIdentifier("X"),
      bindingStatement(
        identifierExpression(lexicalIdentifier("C")),
        identifierExpression(lexicalIdentifier("X")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "B", "C"]),
    );
  });
});
