import Immutable from "immutable";
import { builtIns } from "../../app/oz/built_ins";
import { valueNumber, valueAtom } from "../../app/oz/machine/values";
import { buildVariable } from "../../app/oz/machine/build";

const operator = builtIns["Number"]["div"];

describe("The number division built-in", () => {
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

    it("fails when the first argument is not a number", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: valueNumber(2) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is not a number", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueAtom("person") },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is zero", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(0) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when everything is right", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(3) },
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
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("returns undefined when the second argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("returns the appropriate value when both arguments are valid", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(13) },
        { value: valueNumber(3) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueNumber(4));
    });
  });
});
