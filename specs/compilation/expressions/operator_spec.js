import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  operatorExpression,
  literalExpression,
  functionExpression,
} from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";
import {
  localStatement,
  procedureApplicationStatement,
  sequenceStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when the operator has no expandable subexpressions", () => {
    it("compiles", () => {
      const expression = operatorExpression(
        "+",
        literalExpression(literalNumber(3)),
        literalExpression(literalNumber(4)),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(expression);

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(skipStatement());
    });
  });

  describe("when the operator has expandable subexpressions", () => {
    it("compiles", () => {
      const expression = operatorExpression(
        "+",
        functionExpression(identifier("GetLhs")),
        functionExpression(identifier("GetRhs")),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(
        operatorExpression("+", auxExpression(2), auxExpression(1)),
      );

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(2),
          sequenceStatement(
            procedureApplicationStatement(identifier("GetLhs"), [
              auxExpression(2),
            ]),
            localStatement(
              auxExpressionIdentifier(1),
              sequenceStatement(
                procedureApplicationStatement(identifier("GetRhs"), [
                  auxExpression(1),
                ]),
                skipStatement(),
              ),
            ),
          ),
        ),
      );
    });
  });
});
