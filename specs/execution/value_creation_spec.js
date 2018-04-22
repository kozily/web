import Immutable from "immutable";
import { valueCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber, literalAtom } from "../../app/oz/machine/literals";
import {
  literalExpression,
  identifierExpression,
  operatorExpression,
} from "../../app/oz/machine/expressions";
import { valueNumber, valueRecord } from "../../app/oz/machine/values";
import { failureException } from "../../app/oz/machine/exceptions";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
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
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalExpression(literalNumber(155)),
        ),
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
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalExpression(literalNumber(155)),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              undefined,
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
            buildEquivalenceClass(
              valueNumber(155),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
          ),
        }),
      );
    });
  });

  describe("when the value is an expression", () => {
    it("executes correctly when the expression returns a variable but not a value", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("p", 0),
          ),
          buildEquivalenceClass(undefined, buildVariable("a", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(
          lexicalIdentifier("X"),
          operatorExpression(
            ".",
            identifierExpression(lexicalIdentifier("P")),
            literalExpression(literalAtom("age")),
          ),
        ),
        buildEnvironment({
          P: buildVariable("p", 0),
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueRecord("person", { age: buildVariable("a", 0) }),
              buildVariable("p", 0),
            ),
            buildEquivalenceClass(
              undefined,
              buildVariable("x", 0),
              buildVariable("a", 0),
            ),
          ),
        }),
      );
    });

    it("executes correctly when the expression returns a variable and a value", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("p", 0),
          ),
          buildEquivalenceClass(valueNumber(3), buildVariable("a", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(
          lexicalIdentifier("X"),
          operatorExpression(
            ".",
            identifierExpression(lexicalIdentifier("P")),
            literalExpression(literalAtom("age")),
          ),
        ),
        buildEnvironment({
          P: buildVariable("p", 0),
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueRecord("person", { age: buildVariable("a", 0) }),
              buildVariable("p", 0),
            ),
            buildEquivalenceClass(
              valueNumber(3),
              buildVariable("a", 0),
              buildVariable("x", 0),
            ),
          ),
        }),
      );
    });

    it("executes correctly when the expression returns a value but not a variable", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(
          lexicalIdentifier("X"),
          operatorExpression(
            "+",
            literalExpression(literalNumber(3)),
            literalExpression(literalNumber(5)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(valueNumber(8), buildVariable("x", 0)),
          ),
        }),
      );
    });

    it("blocks the current thread if the whole expression is undefined", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(undefined, buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        valueCreationStatement(
          lexicalIdentifier("X"),
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(5)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("y", 0)),
      );
    });
  });
});
