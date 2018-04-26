import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { cellCreationStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { cellCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Compiling cell creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = cellCreationStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      cellCreationStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
