import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { portCreationExpression } from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  portCreationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling port creation expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = portCreationExpression(lexicalIdentifier("X"));

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            portCreationStatement(lexicalIdentifier("X"), auxExpression()),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = portCreationExpression(lexicalIdentifier("X"));

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        portCreationStatement(lexicalIdentifier("X"), identifier("R")),
      );
    });
  });
});
