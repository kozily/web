import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { literalExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../../app/oz/machine/statements";
import {
  literalNumber,
  literalProcedure,
} from "../../../app/oz/machine/literals";

describe("Compiling literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const expression = literalExpression(literalNumber(10));

    const compilation = compile(expression);

    expect(compilation.resultingExpression).toEqual(expression);

    const resultingStatement = compilation.augmentStatement(skipStatement());

    expect(resultingStatement).toEqual(skipStatement());
  });

  it("compiles recursive literals appropriately", () => {
    const expression = literalExpression(
      literalProcedure([lexicalIdentifier("A")], skipStatementSyntax()),
    );

    const compilation = compile(expression);

    expect(compilation.resultingExpression).toEqual(
      literalExpression(
        literalProcedure([lexicalIdentifier("A")], skipStatement()),
      ),
    );

    const resultingStatement = compilation.augmentStatement(skipStatement());

    expect(resultingStatement).toEqual(skipStatement());
  });
});
