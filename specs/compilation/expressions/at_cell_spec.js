import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  functionExpression,
  atCellExpression,
} from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
  skipStatement,
  cellExchangeStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling at cell expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = atCellExpression(identifier("C"));

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            cellExchangeStatement(
              identifier("C"),
              auxExpressionIdentifier(),
              auxExpression(),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles recursive expressions in the function position", () => {
      const expression = atCellExpression(
        functionExpression(identifier("GetFunction")),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression(2));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(2),
          sequenceStatement(
            localStatement(
              auxExpressionIdentifier(1),
              sequenceStatement(
                procedureApplicationStatement(identifier("GetFunction"), [
                  auxExpression(1),
                ]),
                cellExchangeStatement(
                  auxExpression(1),
                  auxExpressionIdentifier(2),
                  auxExpression(2),
                ),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = atCellExpression(identifier("C"));

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        cellExchangeStatement(
          identifier("C"),
          identifier("R").get("identifier"),
          identifier("R"),
        ),
      );
    });

    it("compiles recursive expressions in function position", () => {
      const expression = atCellExpression(
        functionExpression(identifier("GetFunction")),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(1),
          sequenceStatement(
            procedureApplicationStatement(identifier("GetFunction"), [
              auxExpression(1),
            ]),
            cellExchangeStatement(
              auxExpression(1),
              identifier("R").get("identifier"),
              identifier("R"),
            ),
          ),
        ),
      );
    });
  });
});
