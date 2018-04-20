import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { literalExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { skipStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../app/oz/machine/statements";
import { literalNumber, literalProcedure } from "../../app/oz/machine/literals";

describe("Compiling literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const expression = literalExpression(literalNumber(10));

    expect(compile(expression)).toEqual(expression);
  });

  it("compiles recursive literals appropriately", () => {
    const expression = literalExpression(
      literalProcedure([lexicalIdentifier("A")], skipStatementSyntax()),
    );

    expect(compile(expression)).toEqual(
      literalExpression(
        literalProcedure([lexicalIdentifier("A")], skipStatement()),
      ),
    );
  });
});
