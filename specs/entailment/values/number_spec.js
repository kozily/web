import Immutable from "immutable";
import { valueNumber } from "../../../app/oz/machine/values";
import { buildSigma } from "../../../app/oz/machine/build";
import { entail } from "../../../app/oz/entailment";

describe("Entailing number values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when values are different", () => {
    const args = Immutable.fromJS([
      { value: valueNumber(3) },
      { value: valueNumber(5) },
    ]);
    const result = entail(args, buildSigma());
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when values are equal", () => {
    const args = Immutable.fromJS([
      { value: valueNumber(3) },
      { value: valueNumber(3) },
    ]);
    const result = entail(args, buildSigma());
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });
});
