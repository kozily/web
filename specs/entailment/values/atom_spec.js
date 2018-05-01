import Immutable from "immutable";
import { valueAtom } from "../../../app/oz/machine/values";
import { buildSigma } from "../../../app/oz/machine/build";
import { entail } from "../../../app/oz/entailment";

describe("Entailing atom values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when values are different", () => {
    const args = Immutable.fromJS([
      { value: valueAtom("person") },
      { value: valueAtom("people") },
    ]);
    const result = entail(args, buildSigma());
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when values are equal", () => {
    const args = Immutable.fromJS([
      { value: valueAtom("person") },
      { value: valueAtom("person") },
    ]);
    const result = entail(args, buildSigma());
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });
});
