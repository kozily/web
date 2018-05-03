import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { nameCreationExpression } from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  nameCreationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling name creation expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = nameCreationExpression();

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            nameCreationStatement(auxExpression()),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = nameCreationExpression();

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        nameCreationStatement(identifier("R")),
      );
    });
  });
});
