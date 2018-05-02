import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  exceptionContextExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
  exceptionContextStatement,
} from "../../../app/oz/machine/statements";
import { literalNumber } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling exception context statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles if the exception context statement has statements", () => {
      const expression = exceptionContextExpression(
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(10)),
        },
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(20)),
        },
        lexicalIdentifier("Error"),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            exceptionContextStatement(
              sequenceStatement(
                skipStatement(),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(10)),
                ),
              ),
              lexicalIdentifier("Error"),
              sequenceStatement(
                sequenceStatement(skipStatement(), skipStatement()),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(20)),
                ),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles if the exception context statement doesn't have statements", () => {
      const expression = exceptionContextExpression(
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(20)),
        },
        lexicalIdentifier("Error"),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            exceptionContextStatement(
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(10)),
              ),
              lexicalIdentifier("Error"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(20)),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles if the local statement has statements", () => {
      const expression = exceptionContextExpression(
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(10)),
        },
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(20)),
        },
        lexicalIdentifier("Error"),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        exceptionContextStatement(
          sequenceStatement(
            skipStatement(),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(10)),
            ),
          ),
          lexicalIdentifier("Error"),
          sequenceStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(20)),
            ),
          ),
        ),
      );
    });

    it("compiles if the local statement doesn't have statements", () => {
      const expression = exceptionContextExpression(
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(20)),
        },
        lexicalIdentifier("Error"),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        exceptionContextStatement(
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(10)),
          ),
          lexicalIdentifier("Error"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(20)),
          ),
        ),
      );
    });
  });
});
