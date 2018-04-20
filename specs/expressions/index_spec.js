import Immutable from "immutable";
import { evaluators } from "../../app/oz/expression";
import { allExpressionTypes } from "../../app/oz/machine/expressions";

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
