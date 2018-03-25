import Immutable from "immutable";
import { unify } from "../../../app/oz/machine/store";
import {
  buildStore,
  buildEquivalenceClass,
  buildVariable,
} from "../../../app/oz/machine/build";
import { valueNumber, valueRecord } from "../../samples/values";

describe("Unifying values in the store", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when the values are unbound", () => {
    it("unifies correctly", () => {
      const store = buildStore(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      );

      const unifiedStore = buildStore(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("y", 0),
        ),
      );

      expect(
        unify(store, buildVariable("x", 0), buildVariable("y", 0)),
      ).toEqual(unifiedStore);
    });
  });

  describe("when x is bound and y is unbound", () => {
    it("unifies correctly", () => {
      const store = buildStore(
        buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      );

      const unifiedStore = buildStore(
        buildEquivalenceClass(
          valueNumber(100),
          buildVariable("x", 0),
          buildVariable("y", 0),
        ),
      );

      expect(
        unify(store, buildVariable("x", 0), buildVariable("y", 0)),
      ).toEqual(unifiedStore);
    });
  });

  describe("when y is bound and x is unbound", () => {
    it("unifies correctly", () => {
      const store = buildStore(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(100), buildVariable("y", 0)),
      );

      const unifiedStore = buildStore(
        buildEquivalenceClass(
          valueNumber(100),
          buildVariable("x", 0),
          buildVariable("y", 0),
        ),
      );

      expect(
        unify(store, buildVariable("x", 0), buildVariable("y", 0)),
      ).toEqual(unifiedStore);
    });
  });

  describe("when x is bound and y is bound", () => {
    it("fails if the value types are different", () => {
      const store = buildStore(
        buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
        buildEquivalenceClass(valueRecord("someLabel"), buildVariable("y", 0)),
      );

      expect(() =>
        unify(store, buildVariable("x", 0), buildVariable("y", 0)),
      ).toThrowError("Incompatible value types number and record");
    });
  });
});
