import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { procedureApplicationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { procedureApplicationStatement } from "../../../app/oz/machine/statements";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling procedure application statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = procedureApplicationStatementSyntax(
      identifierExpression(lexicalIdentifier("Sum")),
      [
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
      ],
    );

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(
        identifierExpression(lexicalIdentifier("Sum")),
        [
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ],
      ),
    );
  });
});
