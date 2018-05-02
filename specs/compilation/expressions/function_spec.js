import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { functionExpression } from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling function expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = functionExpression(identifier("Sum"), [
        identifier("A"),
        identifier("B"),
      ]);

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            procedureApplicationStatement(identifier("Sum"), [
              identifier("A"),
              identifier("B"),
              auxExpression(),
            ]),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles recursive expressions in the function position", () => {
      const expression = functionExpression(
        functionExpression(identifier("GetFunction")),
        [identifier("A"), identifier("B")],
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
                procedureApplicationStatement(auxExpression(1), [
                  identifier("A"),
                  identifier("B"),
                  auxExpression(2),
                ]),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles recursive expressions in the argument positions", () => {
      const expression = functionExpression(identifier("Sum"), [
        functionExpression(identifier("GetArg")),
      ]);

      const compilation = compile(expression);

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(2),
          sequenceStatement(
            localStatement(
              auxExpressionIdentifier(1),
              sequenceStatement(
                procedureApplicationStatement(identifier("GetArg"), [
                  auxExpression(1),
                ]),
                procedureApplicationStatement(identifier("Sum"), [
                  auxExpression(1),
                  auxExpression(2),
                ]),
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
      const expression = functionExpression(identifier("Sum"), [
        identifier("A"),
        identifier("B"),
      ]);

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        procedureApplicationStatement(identifier("Sum"), [
          identifier("A"),
          identifier("B"),
          identifier("R"),
        ]),
      );
    });

    it("compiles recursive expressions in function position", () => {
      const expression = functionExpression(
        functionExpression(identifier("GetFunction")),
        [identifier("A"), identifier("B")],
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
            procedureApplicationStatement(auxExpression(1), [
              identifier("A"),
              identifier("B"),
              identifier("R"),
            ]),
          ),
        ),
      );
    });

    it("compiles recursive expressions in argument position", () => {
      const expression = functionExpression(identifier("Sum"), [
        functionExpression(identifier("GetArg")),
      ]);

      const compilation = compile(expression, identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(1),
          sequenceStatement(
            procedureApplicationStatement(identifier("GetArg"), [
              auxExpression(1),
            ]),
            procedureApplicationStatement(identifier("Sum"), [
              auxExpression(1),
              identifier("R"),
            ]),
          ),
        ),
      );
    });
  });
});
