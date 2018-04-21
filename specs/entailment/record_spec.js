import Immutable from "immutable";
import { valueRecord, valueNumber } from "../../app/oz/machine/values";
import {
  buildSigma,
  buildVariable,
  buildEquivalenceClass,
} from "../../app/oz/machine/build";
import { entail } from "../../app/oz/entailment";

describe("Entailing record values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("returns false when the labels are different", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("student", { age: buildVariable("n", 0) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns false when the feature sets are different", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("person", { name: buildVariable("n", 0) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns false when feature values are different", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("person", { age: buildVariable("n", 1) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
      buildEquivalenceClass(valueNumber(4), buildVariable("n", 1)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(false);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns true when features point to the same unbound variable", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("n", 0)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(true);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(undefined);
  });

  it("returns undefined when features point to different unbound variables", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("person", { age: buildVariable("n", 1) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("n", 0)),
      buildEquivalenceClass(undefined, buildVariable("n", 1)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("n", 0));
  });

  it("returns undefined when features point to different variables, the first bound and the second one unbound", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      { value: valueRecord("person", { age: buildVariable("n", 1) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
      buildEquivalenceClass(undefined, buildVariable("n", 1)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("n", 1));
  });

  it("returns undefined when features point to different variables, the first unbound and the second one bound", () => {
    const args = Immutable.fromJS([
      { value: valueRecord("person", { age: buildVariable("n", 1) }) },
      { value: valueRecord("person", { age: buildVariable("n", 0) }) },
    ]);
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
      buildEquivalenceClass(undefined, buildVariable("n", 1)),
    );
    const result = entail(args, sigma);
    expect(result.get("value")).toEqual(undefined);
    expect(result.get("variable")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("n", 1));
  });
});
