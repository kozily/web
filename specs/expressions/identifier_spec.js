import Immutable from "immutable";
import {
  buildEnvironment,
  buildVariable,
  buildEquivalenceClass,
  buildSigma,
} from "../../app/oz/machine/build";
import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { valueNumber } from "../../app/oz/machine/values";
import { evaluate } from "../../app/oz/expression";

describe("Evaluating identifier expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("evaluates to the stored value of the identifier", () => {
    const expression = identifierExpression(lexicalIdentifier("A"));
    const environment = buildEnvironment({
      A: buildVariable("a", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(10), buildVariable("a", 0)),
    );
    const result = evaluate(expression, environment, sigma);
    expect(result.get("value")).toEqual(valueNumber(10));
    expect(result.get("variable")).toEqual(buildVariable("a", 0));
  });

  it("evaluates to undefined if the stored value is undefined", () => {
    const expression = identifierExpression(lexicalIdentifier("A"));
    const environment = buildEnvironment({
      A: buildVariable("a", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("a", 0)),
    );
    const result = evaluate(expression, environment, sigma);
    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(buildVariable("a", 0));
  });
});
