import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { byNeedStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { byNeedStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Compiling by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = byNeedStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      byNeedStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
