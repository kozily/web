import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  threadExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
  threadStatement,
} from "../../../app/oz/machine/statements";
import { literalNumber } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling thread statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles if the thread statement has statements", () => {
      const expression = threadExpression(
        literalExpression(literalNumber(10)),
        skipStatementSyntax(),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            threadStatement(
              sequenceStatement(
                skipStatement(),
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

    it("compiles if the thread statement doesn't have statements", () => {
      const expression = threadExpression(literalExpression(literalNumber(10)));

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            threadStatement(
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
  });

  describe("when providing a resulting identifier", () => {
    it("compiles if the thread statement has statements", () => {
      const expression = threadExpression(
        literalExpression(literalNumber(10)),
        skipStatementSyntax(),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        threadStatement(
          sequenceStatement(
            skipStatement(),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(10)),
            ),
          ),
        ),
      );
    });

    it("compiles if the thread statement doesn't have statements", () => {
      const expression = threadExpression(literalExpression(literalNumber(10)));

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        threadStatement(
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(10)),
          ),
        ),
      );
    });
  });
});
