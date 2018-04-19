import Immutable from "immutable";
import {
  operatorExpression,
  literalExpression,
  identifierExpression,
} from "../../app/oz/machine/expressions";
import { literalNumber, literalAtom } from "../../app/oz/machine/literals";
import { valueNumber, valueRecord } from "../../app/oz/machine/values";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  buildEnvironment,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { evaluate } from "../../app/oz/expression";

describe("Evaluating operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when the operator is a standard mathematical operation", () => {
    it("evaluates to the resulting value of the operation", () => {
      const expression = operatorExpression(
        "+",
        literalExpression(literalNumber(3)),
        literalExpression(literalNumber(5)),
      );

      const result = evaluate(expression);

      expect(result.value).toEqual(valueNumber(8));
    });
  });

  describe("when the operator is a record feature selection", () => {
    it("evaluates to the variable bound to the field", () => {
      const expression = operatorExpression(
        ".",
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalAtom("age")),
      );
      const environment = buildEnvironment({
        X: buildVariable("x", 0),
      });
      const sigma = buildSigma(
        buildEquivalenceClass(
          valueRecord("person", { age: buildVariable("a", 0) }),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
      );

      const result = evaluate(expression, environment, sigma);

      expect(result.value).toEqual(valueNumber(30));
      expect(result.variable).toEqual(buildVariable("a", 0));
    });
  });
});
