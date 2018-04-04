import Immutable from "immutable";
import { valueCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber } from "../../app/oz/machine/literals";
import { valueNumber } from "../../app/oz/machine/values";
import { failureException } from "../../app/oz/machine/exceptions";
import { buildSystemExceptionState } from "./helpers";
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

  describe("when value is incompatible", () => {
    it("raises a system exception", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(
            200,
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, failureException()),
      );
    });
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

      expect(reduce(state, statement, 0)).toEqual(
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
