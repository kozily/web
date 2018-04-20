import Immutable from "immutable";
import { builtIns } from "../../app/oz/machine/built_ins";
import { valueNumber, valueAtom } from "../../app/oz/machine/values";

const operator = builtIns["Number"]["-"];

describe("The number subtraction built-in", () => {
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

    it("fails when the first argument is not a number", () => {
      const args = Immutable.List([valueAtom("person"), valueNumber(2)]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("fails when the second argument is not a number", () => {
      const args = Immutable.List([valueNumber(2), valueAtom("person")]);
      expect(operator.validateArgs(args)).toEqual(false);
    });

    it("succeeds when everything is right", () => {
      const args = Immutable.List([valueNumber(2), valueNumber(3)]);
      expect(operator.validateArgs(args)).toEqual(true);
    });
  });

  describe("evaluation", () => {
    it("returns undefined when the first argument is unbound", () => {
      const args = Immutable.List([undefined, valueNumber(3)]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.value).toEqual(undefined);
      expect(evaluation.missingArg).toEqual(0);
    });

    it("returns undefined when the second argument is unbound", () => {
      const args = Immutable.List([valueNumber(3), undefined]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.value).toEqual(undefined);
      expect(evaluation.missingArg).toEqual(1);
    });

    it("returns the appropriate value when both arguments are valid", () => {
      const args = Immutable.List([valueNumber(4), valueNumber(1)]);
      const evaluation = operator.evaluate(args);
      expect(evaluation.value).toEqual(valueNumber(3));
    });
  });
});
