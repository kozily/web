import Immutable from "immutable";
import { builtIns } from "../../app/oz/built_ins";
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

const operator = builtIns["Record"]["."];

describe("The record selection built-in", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("validation", () => {
    it("fails when less than 2 arguments are used", () => {
      const args = Immutable.List([valueNumber(2)]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when more than 2 arguments are used", () => {
      const args = Immutable.List([
        valueNumber(2),
        valueNumber(3),
        valueNumber(4),
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument is not a record", () => {
      const args = Immutable.List([valueNumber, valueAtom("age")]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is not a record", () => {
      const args = Immutable.List([
        valueRecord("person", { age: buildVariable("x", 0) }),
        valueNumber(3),
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument does not have features", () => {
      const args = Immutable.List([valueRecord("person"), valueAtom("age")]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the first argument does not have the feature of the second argument", () => {
      const args = Immutable.List([
        valueRecord("person", { name: buildVariable("n", 0) }),
        valueAtom("age"),
      ]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when everything is right", () => {
      const args = Immutable.List([
        valueRecord("person", { name: buildVariable("n", 0) }),
        valueAtom("name"),
      ]);
      expect(operator.validateArgs(args)).toEqual(true);
    });
  });

  describe("evaluation", () => {
    it("returns undefined when the first argument is unbound", () => {
      const args = Immutable.List([undefined, valueNumber(3)]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.value).toEqual(undefined);
      expect(evaluation.variable).toEqual(undefined);
      expect(evaluation.missingArg).toEqual(0);
    });

    it("returns undefined when the second argument is unbound", () => {
      const args = Immutable.List([valueNumber(3), undefined]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.value).toEqual(undefined);
      expect(evaluation.variable).toEqual(undefined);
      expect(evaluation.missingArg).toEqual(1);
    });

    it("returns an undefined value but proper variable when the variable is unbound", () => {
      const args = Immutable.List([
        valueRecord("person", { name: buildVariable("n", 0) }),
        valueAtom("name"),
      ]);
      const sigma = buildSigma(
        buildEquivalenceClass(undefined, buildVariable("n", 0)),
      );

      const evaluation = operator.evaluate(args, sigma);

      expect(evaluation.value).toEqual(undefined);
      expect(evaluation.variable).toEqual(buildVariable("n", 0));
    });

    it("returns the value and the variable when everything is bound", () => {
      const args = Immutable.List([
        valueRecord("person", { name: buildVariable("n", 0) }),
        valueAtom("name"),
      ]);
      const sigma = buildSigma(
        buildEquivalenceClass(valueNumber(3), buildVariable("n", 0)),
      );

      const evaluation = operator.evaluate(args, sigma);

      expect(evaluation.value).toEqual(valueNumber(3));
      expect(evaluation.variable).toEqual(buildVariable("n", 0));
    });
  });
});
