import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  localExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { literalNumber } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling local statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = localExpression(
        [lexicalIdentifier("X"), lexicalIdentifier("Y")],
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
            localStatement(
              lexicalIdentifier("X"),
              localStatement(
                lexicalIdentifier("Y"),
                sequenceStatement(
                  skipStatement(),
                  bindingStatement(
                    auxExpression(),
                    literalExpression(literalNumber(10)),
                  ),
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
      const expression = localExpression(
        [lexicalIdentifier("X"), lexicalIdentifier("Y")],
        literalExpression(literalNumber(10)),
        skipStatementSyntax(),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          lexicalIdentifier("X"),
          localStatement(
            lexicalIdentifier("Y"),
            sequenceStatement(
              skipStatement(),
              bindingStatement(
                identifier("R"),
                literalExpression(literalNumber(10)),
              ),
            ),
          ),
        ),
      );
    });
  });
});
