import Immutable from "immutable";
import { evaluators } from "../../app/oz/evaluation";
import { kernelExpressionTypes } from "../../app/oz/machine/expressions";
import { kernelLiteralTypes } from "../../app/oz/machine/literals";

const allExpressionTypes = Object.keys(kernelExpressionTypes);
const allLiteralTypes = Object.keys(kernelLiteralTypes);

describe("Evaluating expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has an evaluator for all expression types", () => {
    const typesWithEvaluators = Immutable.Set(
      Object.keys(evaluators.expression),
    );
    const types = Immutable.Set(allExpressionTypes);

    expect(typesWithEvaluators).toEqual(types);
  });

  it("has an evaluator for all literal types", () => {
    const typesWithEvaluators = Immutable.Set(Object.keys(evaluators.literal));
    const types = Immutable.Set(allLiteralTypes);

    expect(typesWithEvaluators).toEqual(types);
  });
});
