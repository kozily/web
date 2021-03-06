import Immutable from "immutable";
import { unify } from "../../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../../app/oz/machine/build";
import { valueName } from "../../../app/oz/machine/values";

describe("Unifying new name references", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Fails when unifies the names references", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueName(), buildVariable("x", 0)),
      buildEquivalenceClass(valueName(), buildVariable("y", 0)),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible name values");
  });
});
