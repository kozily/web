import Immutable from "immutable";
import { unify } from "../../app/oz/machine/store";
import {
  buildStore,
  buildEquivalenceClass,
  buildVariable,
} from "../../app/oz/machine/build";
import { valueProcedure } from "../samples/values";
import { lexicalIdentifier } from "../samples/lexical";
import { skipStatement } from "../samples/statements";

describe("Unifying procedures", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("unifies correctly if the procedures are compatible", () => {
    const store = buildStore(
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

    const unifiedStore = buildStore(
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

    expect(unify(store, buildVariable("x", 0), buildVariable("y", 0))).toEqual(
      unifiedStore,
    );
  });

  it("fails if the procedureds are not compatible", () => {
    const store = buildStore(
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
      unify(store, buildVariable("x", 0), buildVariable("y", 0)),
    ).toThrowError("Incompatible procedure values");
  });
});
