import Immutable from "immutable";
import { valueName } from "../../../app/oz/machine/values";
import { buildSigma } from "../../../app/oz/machine/build";
import { entail } from "../../../app/oz/entailment";

describe("Entailing new name reference values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when the names are different", () => {
    const args = Immutable.fromJS([
      { value: valueName() },
      { value: valueName() },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when the references are exactly the same", () => {
    const uniqueNewName = valueName();
    const args = Immutable.fromJS([
      { value: uniqueNewName },
      { value: uniqueNewName },
    ]);
    const sigma = buildSigma();
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });
});
