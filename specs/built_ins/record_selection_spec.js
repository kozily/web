import Immutable from "immutable";
import { namespacedBuiltIns } from "../../app/oz/built_ins";
import {
  buildVariable,
  buildEquivalenceClass,
  buildSigma,
} from "../../app/oz/machine/build";
import {
  valueNumber,
  valueAtom,
  valueRecord,
} from "../../app/oz/machine/values";

const operator = namespacedBuiltIns["Record"]["."];

describe("The record selection built-in", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("validation", () => {
    it("fails when less than 2 arguments are used", () => {
      const args = Immutable.fromJS([{ value: valueNumber(2) }]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when more than 2 arguments are used", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(3) },
        { value: valueNumber(4) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument is not a record", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: valueAtom("age") },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is not a record", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { age: buildVariable("x", 0) }) },
        { value: valueNumber(3) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument does not have features", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person") },
        { value: valueAtom("age") },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument does not have the feature of the second argument", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { name: buildVariable("n", 0) }) },
        { value: valueAtom("age") },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when everything is right", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { name: buildVariable("n", 0) }) },
        { value: valueAtom("name") },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the first argument is undefined", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
        { value: valueNumber(3) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the second argument is undefined", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });
  });

  describe("evaluation", () => {
    it("returns undefined when the first argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
        { value: valueNumber(3) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("variable")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("returns undefined when the second argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("variable")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("cascades wait conditions when the first argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: undefined, waitCondition: buildVariable("x", 0) },
        { value: valueNumber(3) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("cascades wait conditions when the second argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: undefined, waitCondition: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("returns an undefined value but proper variable when the variable is unbound", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { name: buildVariable("n", 0) }) },
        { value: valueAtom("name") },
      ]);
      const sigma = buildSigma(
        buildEquivalenceClass(undefined, buildVariable("n", 0)),
      );

      const evaluation = operator.evaluate(args, sigma);

      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("variable")).toEqual(buildVariable("n", 0));
    });

    it("returns the value and the variable when everything is bound", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { name: buildVariable("n", 0) }) },
        { value: valueAtom("name") },
      ]);
      const sigma = buildSigma(
        buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
      );

      const evaluation = operator.evaluate(args, sigma);

      expect(evaluation.get("value")).toEqual(valueNumber(3));
      expect(evaluation.get("variable")).toEqual(buildVariable("n", 0));
    });

    it("returns the value and no variable when it's a nested record", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { name: valueNumber(30) }) },
        { value: valueAtom("name") },
      ]);
      const sigma = buildSigma();

      const evaluation = operator.evaluate(args, sigma);

      expect(evaluation.get("value")).toEqual(valueNumber(30));
      expect(evaluation.get("variable")).toEqual(undefined);
    });
  });
});
