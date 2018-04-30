import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { identifierExpression } from "../../app/oz/machine/expressions";
import {
  conditionalStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  conditionalStatement,
  skipStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = conditionalStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(
        identifierExpression(lexicalIdentifier("X")),
        skipStatement(),
        skipStatement(),
      ),
    );
  });

  it("compiles appropriately conditionals without else", () => {
    const statement = conditionalStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
      ),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(
        identifierExpression(lexicalIdentifier("X")),
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        skipStatement(),
      ),
    );
  });
});
