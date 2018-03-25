import Immutable from "immutable";
import { valueCreationStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import { literalNumber } from "../samples/literals";
import { valueNumber } from "../samples/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/value_creation";

describe("Reducing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when value is a number", () => {
    it("when variable is unbound", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueNumber(155),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              undefined,
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
          ),
        }),
      );
    });
  });
});
