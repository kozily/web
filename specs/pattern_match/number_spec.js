import Immutable from "immutable";
import { literalExpression } from "../../app/oz/machine/expressions";
import { literalNumber, literalAtom } from "../../app/oz/machine/literals";
import { buildSigma, buildEnvironment } from "../../app/oz/machine/build";
import { evaluate } from "../../app/oz/evaluation";
import { patternMatch } from "../../app/oz/pattern_match";

describe("Pattern matching against a number", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("matches when the numbers are the same", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalNumber(2)),
      environment,
      sigma,
    );

    const pattern = literalNumber(2);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(true);
    expect(result.additionalBindings).toEqual(buildEnvironment());
    expect(result.sigma).toEqual(sigma);
  });

  it("does not match when the numbers are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalNumber(2)),
      environment,
      sigma,
    );

    const pattern = literalNumber(10);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when the types are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalAtom("person")),
      environment,
      sigma,
    );

    const pattern = literalNumber(10);

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });
});
