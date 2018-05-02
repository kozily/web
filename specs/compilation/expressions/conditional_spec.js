import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  conditionalExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
  conditionalStatement,
} from "../../../app/oz/machine/statements";
import { literalNumber } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling conditional statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles if the expression has both true clause and false clause", () => {
      const expression = conditionalExpression(
        identifier("X"),
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            conditionalStatement(
              identifier("X"),
              sequenceStatement(
                skipStatement(),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(5)),
                ),
              ),
              sequenceStatement(
                sequenceStatement(skipStatement(), skipStatement()),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(10)),
                ),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles if the expression has both true clause and false clause but no statements", () => {
      const expression = conditionalExpression(
        identifier("X"),
        {
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            conditionalStatement(
              identifier("X"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(5)),
              ),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(10)),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles if the expression has only true clause", () => {
      const expression = conditionalExpression(identifier("X"), {
        statement: undefined,
        expression: literalExpression(literalNumber(5)),
      });

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            conditionalStatement(
              identifier("X"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(5)),
              ),
              skipStatement(),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles if the expression has both true clause and false clause", () => {
      const expression = conditionalExpression(
        identifier("X"),
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        conditionalStatement(
          identifier("X"),
          sequenceStatement(
            skipStatement(),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(5)),
            ),
          ),
          sequenceStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(10)),
            ),
          ),
        ),
      );
    });

    it("compiles if the expression has both true clause and false clause but no statements", () => {
      const expression = conditionalExpression(
        identifier("X"),
        {
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        conditionalStatement(
          identifier("X"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(5)),
          ),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(10)),
          ),
        ),
      );
    });

    it("compiles if the expression has only true clause", () => {
      const expression = conditionalExpression(identifier("X"), {
        statement: undefined,
        expression: literalExpression(literalNumber(5)),
      });

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        conditionalStatement(
          identifier("X"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(5)),
          ),
          skipStatement(),
        ),
      );
    });
  });
});
