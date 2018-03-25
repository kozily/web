import Immutable from "immutable";
import { unify } from "../../app/oz/machine/store";
import {
  buildStore,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueNumber } from "../samples/values";

describe("Unifying numbers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the numbers are the same", () => {
    const store = buildStore(
      buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(100), buildVariable("y", 0)),
    );

    const unifiedStore = buildStore(
      buildEquivalenceClass(
        valueNumber(100),
        buildVariable("x", 0),
        buildVariable("y", 0),
      ),
    );

    expect(unify(store, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedStore,
    );
  });

  it("fails if the numbers are different", () => {
    const store = buildStore(
      buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(101), buildVariable("y", 0)),
    );

    expect(() =>
      unify(store, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible values 100 and 101");
  });
});
