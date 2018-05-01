import Immutable from "immutable";
import { unify } from "../../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../../app/oz/machine/build";
import { valueBuiltIn } from "../../../app/oz/machine/values";

describe("Unifying built-ins", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the built-ins are compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueBuiltIn("+", "Number"), buildVariable("x", 0)),
      buildEquivalenceClass(valueBuiltIn("+", "Number"), buildVariable("y", 0)),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        valueBuiltIn("+", "Number"),
        buildVariable("x", 0),
        buildVariable("y", 0),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("fails if the built-ins are not compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueBuiltIn("+", "Number"), buildVariable("x", 0)),
      buildEquivalenceClass(valueBuiltIn("-", "Number"), buildVariable("y", 0)),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible built-in values");
  });
});
