import Immutable from "immutable";
import { namespacedBuiltIns } from "../../app/oz/built_ins";
import {
  valueNumber,
  valueAtom,
  valueBoolean,
} from "../../app/oz/machine/values";
import { buildVariable, buildSigma } from "../../app/oz/machine/build";

const entailmentOperator = namespacedBuiltIns["Value"]["=="];
const disentailmentOperator = namespacedBuiltIns["Value"]["\\="];

const expectSuccessfulEvaluationResult = (
  args,
  expectedResult,
  sigma = buildSigma(),
) => {
  const eqEvaluation = entailmentOperator.evaluate(args, sigma);
  expect(eqEvaluation.get("value")).toEqual(valueBoolean(expectedResult));
  expect(eqEvaluation.get("variable")).toEqual(undefined);
  expect(eqEvaluation.get("waitCondition")).toEqual(undefined);

  const neqEvaluation = disentailmentOperator.evaluate(args, sigma);
  expect(neqEvaluation.get("value")).toEqual(valueBoolean(!expectedResult));
  expect(neqEvaluation.get("variable")).toEqual(undefined);
  expect(neqEvaluation.get("waitCondition")).toEqual(undefined);
};

const expectUndefinedEvaluationResult = (
  args,
  waitCondition,
  sigma = buildSigma(),
) => {
  const eqEvaluation = entailmentOperator.evaluate(args, sigma);
  expect(eqEvaluation.get("value")).toEqual(undefined);
  expect(eqEvaluation.get("variable")).toEqual(undefined);
  expect(eqEvaluation.get("waitCondition")).toEqual(waitCondition);

  const neqEvaluation = disentailmentOperator.evaluate(args, sigma);
  expect(neqEvaluation.get("value")).toEqual(undefined);
  expect(neqEvaluation.get("variable")).toEqual(undefined);
  expect(neqEvaluation.get("waitCondition")).toEqual(waitCondition);
};

describe("The entailment/disentailment check built-ins", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("validation", () => {
    it("fails when less than 2 arguments are used", () => {
      const args = Immutable.fromJS([{ value: valueNumber(2) }]);
      expect(entailmentOperator.validateArgs(args)).toEqual(false);
      expect(disentailmentOperator.validateArgs(args)).toEqual(false);
    });

    it("fails when more than 2 arguments are used", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(2) },
        { value: valueNumber(3) },
        { value: valueNumber(4) },
      ]);
      expect(entailmentOperator.validateArgs(args)).toEqual(false);
      expect(disentailmentOperator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when everything is right", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(5) },
        { value: valueAtom("person") },
      ]);
      expect(entailmentOperator.validateArgs(args)).toEqual(true);
      expect(disentailmentOperator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the first argument is undefined", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
        { value: valueNumber(3) },
      ]);
      expect(entailmentOperator.validateArgs(args)).toEqual(true);
      expect(disentailmentOperator.validateArgs(args)).toEqual(true);
    });

    it("succeeds when the second argument is undefined", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      expect(entailmentOperator.validateArgs(args)).toEqual(true);
      expect(disentailmentOperator.validateArgs(args)).toEqual(true);
    });
  });

  describe("evaluation", () => {
    it("returns false when the value types are different", () => {
      const args = Immutable.fromJS([
        { value: valueNumber(3) },
        { value: valueAtom("person") },
      ]);
      expectSuccessfulEvaluationResult(args, false);
    });

    it("returns undefined when the first argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: undefined, variable: buildVariable("x", 0) },
        { value: valueAtom("person") },
      ]);
      expectUndefinedEvaluationResult(args, buildVariable("x", 0));
    });

    it("returns undefined when the second argument is unbound", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: undefined, variable: buildVariable("x", 0) },
      ]);
      expectUndefinedEvaluationResult(args, buildVariable("x", 0));
    });

    it("cascades wait conditions when the first argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: undefined, waitCondition: buildVariable("x", 0) },
        { value: valueAtom("person") },
      ]);
      expectUndefinedEvaluationResult(args, buildVariable("x", 0));
    });

    it("cascades wait conditions when the second argument is a wait condition", () => {
      const args = Immutable.fromJS([
        { value: valueAtom("person") },
        { value: undefined, waitCondition: buildVariable("x", 0) },
      ]);
      expectUndefinedEvaluationResult(args, buildVariable("x", 0));
    });
  });
});
