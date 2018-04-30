import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import {
  bindingStatementSyntax,
  skipStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  bindingStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  literalExpression,
  identifierExpression,
} from "../../app/oz/machine/expressions";
import { literalNumber, literalProcedure } from "../../app/oz/machine/literals";

describe("Compiling binding statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately when using simple values", () => {
    const statement = bindingStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      literalExpression(literalNumber(3)),
    );

    expect(compile(statement)).toEqual(
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(3)),
      ),
    );
  });

  it("compiles appropriately when using procedures", () => {
    const statement = bindingStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      literalExpression(
        literalProcedure([lexicalIdentifier("X")], skipStatementSyntax()),
      ),
    );

    expect(compile(statement)).toEqual(
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(
          literalProcedure([lexicalIdentifier("X")], skipStatement()),
        ),
      ),
    );
  });
});
