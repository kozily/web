import Immutable from "immutable";
import { literalExpression } from "../../app/oz/machine/expressions";
import {
  literalNumber,
  literalBoolean,
  literalRecord,
} from "../../app/oz/machine/literals";
import { buildSigma, buildEnvironment } from "../../app/oz/machine/build";
import { evaluate } from "../../app/oz/expression";
import { patternMatch } from "../../app/oz/pattern_match";

describe("Pattern matching against an boolean", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("matches when the boolean are the same", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalBoolean(true)),
      environment,
      sigma,
    );

    const pattern = literalBoolean(true);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(true);
    expect(result.additionalBindings).toEqual(buildEnvironment());
    expect(result.sigma).toEqual(sigma);
  });

  it("does not match when the types are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalNumber(10)),
      environment,
      sigma,
    );

    const pattern = literalBoolean(true);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when the value has features", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalRecord("person", { age: literalNumber(10) })),
      environment,
      sigma,
    );

    const pattern = literalBoolean(true);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when the booleans are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalBoolean(true)),
      environment,
      sigma,
    );

    const pattern = literalBoolean(false);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });
});
