import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import {
  patternMatchingStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalRecord } from "../../../app/oz/machine/literals";

describe("Collecting free identifiers in a pattern matching statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the appropriate identifiers", () => {
    const statement = patternMatchingStatement(
      operatorExpression(
        "==",
        identifierExpression(lexicalIdentifier("P")),
        identifierExpression(lexicalIdentifier("Q")),
      ),
      literalRecord("person", {
        age: lexicalIdentifier("A"),
        name: lexicalIdentifier("N"),
      }),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Q", "Y", "Z", "N"]),
    );
  });
});
