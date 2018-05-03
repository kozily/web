import Immutable from "immutable";
import { evaluate } from "../../../app/oz/evaluation";
import { literalNumber } from "../../../app/oz/machine/literals";
import { valueNumber } from "../../../app/oz/machine/values";

describe("Evaluating literal numbers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a number value", () => {
    const literal = literalNumber(155);
    const result = evaluate(literal);

    expect(result.get("value")).toEqual(valueNumber(155));
  });
});
