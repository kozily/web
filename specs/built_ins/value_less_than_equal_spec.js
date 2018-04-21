import Immutable from "immutable";
import { builtIns } from "../../app/oz/built_ins";
import {
  valueNumber,
  valueAtom,
  valueRecord,
  valueBoolean,
} from "../../app/oz/machine/values";
import { buildVariable } from "../../app/oz/machine/build";

const operator = builtIns["Value"]["<="];

describe("The value less than built-in", () => {
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

    it("fails when the first argument is not a number or an atom", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { age: buildVariable("x", 0) }) },
        { value: valueAtom("person") },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is not a number or an atom", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: valueRecord("person", { age: buildVariable("x", 0) }) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when both arguments are valid numbers", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(3) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when both arguments are valid atoms", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: valueAtom("person") },
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

    it("returns true when the first argument is a number less than the second argument", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(3) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueBoolean(true));
    });

    it("returns true when the first argument is an atom less than the second argument", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: valueAtom("qerson") },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueBoolean(true));
    });
  });
});
