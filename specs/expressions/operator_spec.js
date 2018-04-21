import Immutable from "immutable";
import {
  operatorExpression,
  literalExpression,
  identifierExpression,
} from "../../app/oz/machine/expressions";
import {
  buildVariable,
  buildEnvironment,
  buildEquivalenceClass,
  buildSigma,
} from "../../app/oz/machine/build";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber } from "../../app/oz/machine/literals";
import { valueNumber } from "../../app/oz/machine/values";
import { evaluate } from "../../app/oz/expression";

describe("Evaluating operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("evaluates to the resulting value of the operation", () => {
    const expression = operatorExpression(
      "+",
      literalExpression(literalNumber(3)),
      literalExpression(literalNumber(5)),
    );

    const result = evaluate(expression);

    expect(result.get("value")).toEqual(valueNumber(8));
  });

  it("evaluates to a wait condition if any of the values are undefined", () => {
    const expression = operatorExpression(
      "+",
      literalExpression(literalNumber(3)),
      identifierExpression(lexicalIdentifier("A")),
    );
    const environment = buildEnvironment({
      A: buildVariable("a", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("a", 0)),
    );

    const result = evaluate(expression, environment, sigma);

    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("a", 0));
  });

  it("evaluates to a wait condition if any of the values have wait conditions", () => {
    const expression = operatorExpression(
      "+",
      operatorExpression(
        "*",
        literalExpression(literalNumber(3)),
        identifierExpression(lexicalIdentifier("A")),
      ),
      literalExpression(literalNumber(3)),
    );
    const environment = buildEnvironment({
      A: buildVariable("a", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("a", 0)),
    );

    const result = evaluate(expression, environment, sigma);

    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("a", 0));
  });
});
