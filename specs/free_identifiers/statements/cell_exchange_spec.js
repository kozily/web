import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { cellExchangeStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Collecting free identifiers in a cell exchange statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all involved identifiers", () => {
    const statement = cellExchangeStatement(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("Y"),
      identifierExpression(lexicalIdentifier("Z")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y", "Z"]),
    );
  });

  it("collects all involved identifiers ignoring the any identifiers", () => {
    const statement = cellExchangeStatement(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("_"),
      identifierExpression(lexicalIdentifier("Z")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Z"]),
    );
  });
});
