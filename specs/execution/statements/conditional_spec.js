import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  bindingStatement,
  conditionalStatement,
} from "../../../app/oz/machine/statements";
import {
  identifierExpression,
  operatorExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import { valueNumber, valueRecord } from "../../../app/oz/machine/values";
import { errorException } from "../../../app/oz/machine/exceptions";
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

describe("Reducing if statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when value is not valid", () => {
    it("error when variable is number", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueNumber(24),
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
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("error when variable is a record with features", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
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
        ),
      });

      const statement = buildSemanticStatement(
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("error when variable is a record with no features wrong label", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueRecord("person"),
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
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });
  });

  describe("when value is valid", () => {
    it("when variable is true", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueRecord("true"),
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
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(84)),
          ),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(345)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              bindingStatement(
                identifierExpression(lexicalIdentifier("Y")),
                literalExpression(literalNumber(84)),
              ),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });

    it("when variable is false", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueRecord("false"),
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
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(84)),
          ),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(345)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              bindingStatement(
                identifierExpression(lexicalIdentifier("Y")),
                literalExpression(literalNumber(345)),
              ),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });
  });

  describe("When value is unbound", () => {
    it("blocks the current thread", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
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
        conditionalStatement(
          identifierExpression(lexicalIdentifier("X")),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(84)),
          ),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(345)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("x", 0)),
      );
    });
  });

  describe("when the expression blocks", () => {
    it("blocks the current thread", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
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
        conditionalStatement(
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("X")),
            identifierExpression(lexicalIdentifier("X")),
          ),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(84)),
          ),
          bindingStatement(
            identifierExpression(lexicalIdentifier("Y")),
            literalExpression(literalNumber(345)),
          ),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("x", 0)),
      );
    });
  });
});
