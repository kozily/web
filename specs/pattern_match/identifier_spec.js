import Immutable from "immutable";
import { literalExpression } from "../../app/oz/machine/expressions";
import { literalNumber } from "../../app/oz/machine/literals";
import { valueNumber } from "../../app/oz/machine/values";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  buildSigma,
  buildEquivalenceClass,
  buildEnvironment,
  buildVariable,
  getLastAuxiliaryIdentifier,
} from "../../app/oz/machine/build";
import { evaluate } from "../../app/oz/evaluation";
import { patternMatch } from "../../app/oz/pattern_match";

describe("Pattern matching against an identifier", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("always matches", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalNumber(2)),
      environment,
      sigma,
    );

    const pattern = lexicalIdentifier("X");

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(true);
    expect(result.additionalBindings).toEqual(
      buildEnvironment({
        X: buildVariable(
          getLastAuxiliaryIdentifier("patternMatch").get("identifier"),
          0,
        ),
      }),
    );
    expect(result.sigma).toEqual(
      buildSigma(
        buildEquivalenceClass(
          valueNumber(2),
          buildVariable(
            getLastAuxiliaryIdentifier("patternMatch").get("identifier"),
            0,
          ),
        ),
      ),
    );
  });
});
