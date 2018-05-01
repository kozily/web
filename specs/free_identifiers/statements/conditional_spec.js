import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import {
  conditionalStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Collecting free identifiers in a conditional statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all identifiers from the condition and all substatements", () => {
    const statement = conditionalStatement(
      operatorExpression(
        "==",
        identifierExpression(lexicalIdentifier("P")),
        identifierExpression(lexicalIdentifier("Q")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Q", "A", "B", "X", "Y"]),
    );
  });
});
