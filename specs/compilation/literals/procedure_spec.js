import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { literalProcedure } from "../../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling procedure values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const literal = literalProcedure(
      [lexicalIdentifier("A", lexicalIdentifier("B"))],
      skipStatementSyntax(),
    );

    const compilation = compile(literal);

    expect(compilation.resultingExpression).toEqual(
      literalProcedure(
        [lexicalIdentifier("A", lexicalIdentifier("B"))],
        skipStatement(),
      ),
    );

    const resultingStatement = compilation.augmentStatement(skipStatement());
    expect(resultingStatement).toEqual(skipStatement());
  });
});
