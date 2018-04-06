import Immutable from "immutable";
import { unify } from "../../app/oz/machine/sigma";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueProcedure } from "../../app/oz/machine/values";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { skipStatement } from "../../app/oz/machine/statements";

describe("Unifying procedures", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the procedures are compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          skipStatement(),
          {},
        ),
        buildVariable("x", 0),
      ),
      buildEquivalenceClass(
        valueProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          skipStatement(),
          {},
        ),
        buildVariable("y", 0),
      ),
    );

    const unifiedSigma = buildSigma(
      buildEquivalenceClass(
        valueProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          skipStatement(),
          {},
        ),
        buildVariable("x", 0),
        buildVariable("y", 0),
      ),
    );

    expect(unify(sigma, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedSigma,
    );
  });

  it("fails if the procedureds are not compatible", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          skipStatement(),
          {},
        ),
        buildVariable("x", 0),
      ),
      buildEquivalenceClass(
        valueProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("W")],
          skipStatement(),
          {},
        ),
        buildVariable("y", 0),
      ),
    );

    expect(() =>
      unify(sigma, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible procedure values");
  });
});
