import Immutable from "immutable";
import { unify } from "../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueMutableVariable } from "../../app/oz/machine/values";

describe("Unifying mutable references", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the mutable references are compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueMutableVariable("cell", 0),
        buildVariable("x", 0),
      ),
      buildEquivalenceClass(
        valueMutableVariable("cell", 0),
        buildVariable("y", 0),
      ),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        valueMutableVariable("cell", 0),
        buildVariable("x", 0),
        buildVariable("y", 0),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("fails if the mutable references are not compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueMutableVariable("cell", 0),
        buildVariable("x", 0),
      ),
      buildEquivalenceClass(
        valueMutableVariable("cell", 1),
        buildVariable("y", 0),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible mutable values");
  });
});
