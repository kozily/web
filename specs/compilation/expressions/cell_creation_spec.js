import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  cellCreationExpression,
  functionExpression,
} from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  cellCreationStatement,
  skipStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling cell creation expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles unexpandable expressions", () => {
      const expression = cellCreationExpression(identifier("X"));

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            cellCreationStatement(identifier("X"), auxExpression()),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles expandable expressions", () => {
      const expression = cellCreationExpression(
        functionExpression(identifier("X")),
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
                procedureApplicationStatement(identifier("X"), [
                  auxExpression(1),
                ]),
                cellCreationStatement(auxExpression(1), auxExpression(2)),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles unexpandable expressions", () => {
      const expression = cellCreationExpression(identifier("X"));

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        cellCreationStatement(identifier("X"), identifier("R")),
      );
    });

    it("compiles expandable expressions", () => {
      const expression = cellCreationExpression(
        functionExpression(identifier("X")),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            procedureApplicationStatement(identifier("X"), [auxExpression()]),
            cellCreationStatement(auxExpression(1), identifier("R")),
          ),
        ),
      );
    });
  });
});
