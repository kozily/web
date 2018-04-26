import Immutable from "immutable";
import { noNamespacedBuiltIns } from "../../app/oz/built_ins";
import {
  valueRecord,
  valueBoolean,
  valueNumber,
  valueAtom,
  valueTuple,
  valueString,
  valueProcedure,
  valueBuiltIn,
} from "../../app/oz/machine/values";
import { buildVariable } from "../../app/oz/machine/build";
import { skipStatement } from "../../app/oz/machine/statements";

const operator = noNamespacedBuiltIns["IsDet"];

describe("The no namespace is determined built-in", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("validation", () => {
    it("fails when there are no arguments", () => {
      const args = Immutable.fromJS([]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when more than 1 arguments are used", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(1) },
        { value: valueNumber(2) },
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when the argument is an atom", () => {
      const args = Immutable.fromJS([{ value: valueAtom("person") }]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a number", () => {
      const args = Immutable.fromJS([{ value: valueNumber(2) }]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a record", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { age: buildVariable("n", 0) }) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a procedure", () => {
      const args = Immutable.fromJS([
        { value: valueProcedure([], skipStatement(), {}) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a builtin", () => {
      const args = Immutable.fromJS([{ value: valueBuiltIn("+", "Number") }]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a boolean", () => {
      const args = Immutable.fromJS([{ value: valueBoolean(true) }]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a string", () => {
      const args = Immutable.fromJS([{ value: valueString("house") }]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is a tuple", () => {
      const args = Immutable.fromJS([
        {
          value: valueTuple("numbers", [
            buildVariable("one", 0),
            buildVariable("two", 0),
          ]),
        },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the argument is undefined", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });
  });

  describe("evaluation", () => {
    it("returns false when the argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueBoolean(false));
      expect(evaluation.get("waitCondition")).toEqual(undefined);
    });

    it("Does not cascade wait conditions when the argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: undefined, waitCondition: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueBoolean(false));
      expect(evaluation.get("waitCondition")).toEqual(undefined);
    });

    it("returns true boolean value when the argument is valid", () => {
      const args = Immutable.fromJS([{ value: valueNumber(2) }]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueBoolean(true));
    });
  });
});
