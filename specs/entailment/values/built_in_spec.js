import Immutable from "immutable";
import { valueBuiltIn } from "../../../app/oz/machine/values";
import { buildSigma } from "../../../app/oz/machine/build";
import { entail } from "../../../app/oz/entailment";

describe("Entailing built in values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when the operators are different", () => {
    const args = Immutable.fromJS([
      { value: valueBuiltIn("+", "Number") },
      { value: valueBuiltIn("-", "Number") },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns false when the namespaces are different", () => {
    const args = Immutable.fromJS([
      { value: valueBuiltIn("+", "Number") },
      { value: valueBuiltIn("+", "Float") },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when the built ins are exactly the same", () => {
    const args = Immutable.fromJS([
      { value: valueBuiltIn("+", "Number") },
      { value: valueBuiltIn("+", "Number") },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });
});
