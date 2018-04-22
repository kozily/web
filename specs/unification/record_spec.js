import Immutable from "immutable";
import { unify } from "../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueNumber, valueRecord } from "../../app/oz/machine/values";

describe("Unifying records", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the records have same labels, same features and same values in features", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("z", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("unifies correctly if the records have same labels, same features and different values in features", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("w", 0) }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
      buildEquivalenceClass(undefined, buildVariable("w", 0)),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
        buildVariable("w", 0),
      ),
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("z", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("unifies correctly recursive unifications", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { address: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", { address: buildVariable("p", 0) }),
        buildVariable("z", 0),
      ),
      buildEquivalenceClass(
        valueRecord("address", { street: buildVariable("a", 0) }),
        buildVariable("y", 0),
      ),
      buildEquivalenceClass(
        valueRecord("address", { street: buildVariable("b", 0) }),
        buildVariable("p", 0),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("a", 0),
        buildVariable("b", 0),
      ),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        undefined,
        buildVariable("a", 0),
        buildVariable("b", 0),
      ),
      buildEquivalenceClass(
        valueRecord("address", { street: buildVariable("a", 0) }),
        buildVariable("y", 0),
        buildVariable("p", 0),
      ),
      buildEquivalenceClass(
        valueRecord("person", { address: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
        buildVariable("z", 0),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("z", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("fails if the records have different labels", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        valueRecord("address", { name: buildVariable("y", 0) }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("z", 0)),
    ).toThrowError("Incompatible labels person and address");
  });

  it("fails if the records have different amount of features", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", {
          name: buildVariable("y", 0),
          lastname: buildVariable("y", 1),
        }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("z", 0)),
    ).toThrowError("Incompatible features name and name,lastname");
  });

  it("fails if the records have different features", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        undefined,
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
      buildEquivalenceClass(
        valueRecord("person", {
          lastname: buildVariable("y", 0),
        }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("z", 0)),
    ).toThrowError("Incompatible features name and lastname");
  });

  it("fails if the records have different values in the features", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("person", { name: buildVariable("y", 0) }),
        buildVariable("x", 0),
        buildVariable("x", 1),
      ),
      buildEquivalenceClass(
        valueNumber(10),
        buildVariable("y", 0),
        buildVariable("y", 1),
      ),
      buildEquivalenceClass(valueNumber(24), buildVariable("w", 0)),
      buildEquivalenceClass(
        valueRecord("person", {
          name: buildVariable("w", 0),
        }),
        buildVariable("z", 0),
        buildVariable("z", 1),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("z", 0)),
    ).toThrowError("Incompatible values 10 and 24");
  });
});
