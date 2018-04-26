import Immutable from "immutable";
import { noNamespacedBuiltIns } from "../../app/oz/built_ins";
import {
  valueRecord,
  valueNumber,
  valueAtom,
  valueList,
} from "../../app/oz/machine/values";
import { buildVariable } from "../../app/oz/machine/build";

const operator = noNamespacedBuiltIns["Arity"];

describe("The no namespace arity built-in", () => {
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

    it("fails when the argument is not a record", () => {
      const args = Immutable.fromJS([{ value: valueNumber(2) }]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when the argument is a record", () => {
      const args = Immutable.fromJS([
        { value: valueRecord("person", { age: buildVariable("n", 0) }) },
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
    it("returns undefined when the argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("cascades wait conditions when the argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(undefined);
      expect(evaluation.get("waitCondition")).toEqual(buildVariable("x", 0));
    });

    it("returns the list of features when the argument has features", () => {
      const args = Immutable.fromJS([
        {
          value: valueRecord("person", {
            name: buildVariable("a", 0),
            age: buildVariable("a", 1),
          }),
          variable: buildVariable("x", 0),
        },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(
        valueList([valueAtom("age"), valueAtom("name")]),
      );
      expect(evaluation.get("waitCondition")).toEqual(undefined);
    });

    it("returns an empty list when the argument has no features", () => {
      const args = Immutable.fromJS([
        {
          value: valueAtom("person"),
          variable: buildVariable("x", 0),
        },
      ]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.get("value")).toEqual(valueList([]));
      expect(evaluation.get("waitCondition")).toEqual(undefined);
    });
  });
});
