import Immutable from "immutable";
import { evaluators } from "../../app/oz/evaluation";
import { kernelExpressionTypes } from "../../app/oz/machine/expressions";

const allExpressionTypes = Object.keys(kernelExpressionTypes);

describe("Evaluating expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has an evaluator for all expression types", () => {
    const typesWithEvaluators = Immutable.Set(Object.keys(evaluators));
    const types = Immutable.Set(allExpressionTypes);

    expect(typesWithEvaluators).toEqual(types);
  });
});
