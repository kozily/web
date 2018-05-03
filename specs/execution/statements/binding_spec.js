import Immutable from "immutable";
import {
  bindingStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalNumber,
  literalAtom,
  literalRecord,
} from "../../../app/oz/machine/literals";
import {
  literalExpression,
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { valueNumber, valueRecord } from "../../../app/oz/machine/values";
import { failureException } from "../../../app/oz/machine/exceptions";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";
import { getLastEnvironmentIndex } from "../../../app/oz/machine/environment";

describe("Reducing binding statements", () => {
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(155)),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(155)),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
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

      expect(execute(state, statement, 0)).toEqual(
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
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

      expect(execute(state, statement, 0)).toEqual(
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

    it("executes correctly keeping the environment index", () => {
      const lastIndex = getLastEnvironmentIndex();
      const state = buildSingleThreadedState({
        semanticStatement: [
          buildSemanticStatement(skipStatement(), buildEnvironment(), {
            environmentIndex: lastIndex,
          }),
        ],
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
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
        { environmentIndex: lastIndex },
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatement: [
            buildSemanticStatement(skipStatement(), buildEnvironment(), {
              environmentIndex: lastIndex,
            }),
          ],
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
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

      expect(execute(state, statement, 0)).toEqual(
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
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
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

      expect(execute(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("y", 0)),
      );
    });
  });

  describe("when using identifiers on both sides", () => {
    it("merges the equivalence classes when both are unbound", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(undefined, buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              undefined,
              buildVariable("x", 0),
              buildVariable("y", 0),
            ),
          ),
        }),
      );
    });

    it("merges the equivalence classes when one is bound and the other unbound", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueNumber(5),
              buildVariable("y", 0),
              buildVariable("x", 0),
            ),
          ),
        }),
      );
    });

    it("merges the equivalence classes when both variables are bound to compatible values", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(5), buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueNumber(5),
              buildVariable("x", 0),
              buildVariable("y", 0),
            ),
          ),
        }),
      );
    });

    it("raises a failure when both variables are pointing to incompatible values", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(5), buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, failureException()),
      );
    });
  });

  describe("when using complex binding patterns with expressions and literals on both sides", () => {
    it("blocks the current thread if the lhs expression blocks", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(undefined, buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(5)),
          ),
          identifierExpression(lexicalIdentifier("X")),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("y", 0)),
      );
    });

    it("does nothing if lhs and rhs expressions resolve to the same value", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(5), buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(2), buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("X")),
            literalExpression(literalNumber(5)),
          ),
          operatorExpression(
            "*",
            literalExpression(literalNumber(5)),
            identifierExpression(lexicalIdentifier("Y")),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(state);
    });

    it("merges equivalence classes appropriately when using partial values on both sides", () => {
      const state = buildSingleThreadedState({
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("y", 0)),
          buildEquivalenceClass(undefined, buildVariable("z", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        bindingStatement(
          literalExpression(
            literalRecord("person", {
              age: identifierExpression(lexicalIdentifier("X")),
              height: literalExpression(literalNumber(1.7)),
              gender: literalExpression(literalAtom("male")),
            }),
          ),
          literalExpression(
            literalRecord("person", {
              age: identifierExpression(lexicalIdentifier("Y")),
              height: identifierExpression(lexicalIdentifier("Z")),
              gender: literalExpression(literalAtom("male")),
            }),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
          Z: buildVariable("z", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          sigma: buildSigma(
            buildEquivalenceClass(
              valueNumber(30),
              buildVariable("y", 0),
              buildVariable("x", 0),
            ),
            buildEquivalenceClass(valueNumber(1.7), buildVariable("z", 0)),
          ),
        }),
      );
    });
  });
});
