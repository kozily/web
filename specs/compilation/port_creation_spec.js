import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { portCreationStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { portCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Compiling port creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = portCreationStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      portCreationStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
