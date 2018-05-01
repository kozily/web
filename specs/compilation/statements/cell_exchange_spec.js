import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { cellExchangeStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { cellExchangeStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Compiling cell exchange statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = cellExchangeStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("Y"),
      identifierExpression(lexicalIdentifier("Z")),
    );

    expect(compile(statement)).toEqual(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
    );
  });
});
