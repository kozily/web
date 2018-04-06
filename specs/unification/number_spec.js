import Immutable from "immutable";
import { unify } from "../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueNumber } from "../../app/oz/machine/values";

describe("Unifying numbers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the numbers are the same", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(100), buildVariable("y", 0)),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        valueNumber(100),
        buildVariable("x", 0),
        buildVariable("y", 0),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("fails if the numbers are different", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(100), buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(101), buildVariable("y", 0)),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible values 100 and 101");
  });
});
