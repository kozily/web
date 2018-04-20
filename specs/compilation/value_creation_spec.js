import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import {
  valueCreationStatementSyntax,
  skipStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  valueCreationStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { literalExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber, literalProcedure } from "../../app/oz/machine/literals";

describe("Compiling value creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately when using simple values", () => {
    const statement = valueCreationStatementSyntax(
      lexicalIdentifier("X"),
      literalExpression(literalNumber(3)),
    );

    expect(compile(statement)).toEqual(
      valueCreationStatement(
        lexicalIdentifier("X"),
        literalExpression(literalNumber(3)),
      ),
    );
  });

  it("compiles appropriately when using procedures", () => {
    const statement = valueCreationStatementSyntax(
      lexicalIdentifier("X"),
      literalExpression(
        literalProcedure([lexicalIdentifier("X")], skipStatementSyntax()),
      ),
    );

    expect(compile(statement)).toEqual(
      valueCreationStatement(
        lexicalIdentifier("X"),
        literalExpression(
          literalProcedure([lexicalIdentifier("X")], skipStatement()),
        ),
      ),
    );
  });
});
