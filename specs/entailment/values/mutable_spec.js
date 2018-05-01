import Immutable from "immutable";
import { valueMutableVariable } from "../../../app/oz/machine/values";
import { buildSigma } from "../../../app/oz/machine/build";
import { entail } from "../../../app/oz/entailment";

describe("Entailing mutable reference values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when the kinds are different", () => {
    const args = Immutable.fromJS([
      { value: valueMutableVariable("cell", 1) },
      { value: valueMutableVariable("port", 1) },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns false when the sequence numbers are different", () => {
    const args = Immutable.fromJS([
      { value: valueMutableVariable("cell", 1) },
      { value: valueMutableVariable("cell", 0) },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when the references are exactly the same", () => {
    const args = Immutable.fromJS([
      { value: valueMutableVariable("cell", 1) },
      { value: valueMutableVariable("cell", 1) },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });
});
