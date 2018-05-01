import Immutable from "immutable";
import { literalExpression } from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";
import { valueNumber } from "../../../app/oz/machine/values";
import { evaluate } from "../../../app/oz/evaluation";

describe("Evaluating literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("evaluates to the created value of the literal", () => {
    const expression = literalExpression(literalNumber(10));
    const result = evaluate(expression);
    expect(result.get("value")).toEqual(valueNumber(10));
  });
});
