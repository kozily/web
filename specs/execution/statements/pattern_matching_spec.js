import Immutable from "immutable";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import {
  skipStatement,
  sequenceStatement,
  patternMatchingStatement,
} from "../../../app/oz/machine/statements";
import { buildBlockedState } from "./helpers";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import { valueNumber } from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { getLastEnvironmentIndex } from "../../../app/oz/machine/environment";
import { execute } from "../../../app/oz/execution";

describe("Reducing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when the expression has a value", () => {
    it("executes correctly when the pattern matches and new identifiers are bound", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        patternMatchingStatement(
          identifierExpression(lexicalIdentifier("X")),
          lexicalIdentifier("Y"),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      const lastIndex = getLastEnvironmentIndex();
      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              sequenceStatement(skipStatement(), skipStatement()),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("x", 0),
              }),
              { environmentIndex: lastIndex + 1 },
            ),
            buildSemanticStatement(skipStatement(), buildEnvironment(), {
              environmentIndex: lastIndex,
            }),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });

    it("executes correctly when the pattern matches and no new identifiers are bound", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        patternMatchingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalNumber(10),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              sequenceStatement(skipStatement(), skipStatement()),
              buildEnvironment({
                X: buildVariable("x", 0),
              }),
            ),
            buildSemanticStatement(skipStatement(), buildEnvironment()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });

    it("executes correctly when the pattern does not match", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        patternMatchingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalNumber(15),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              skipStatement(),
              buildEnvironment({
                X: buildVariable("x", 0),
              }),
            ),
            buildSemanticStatement(skipStatement(), buildEnvironment()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });
  });

  describe("when the case identifier is unbound", () => {
    it("blocks the current thread", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        patternMatchingStatement(
          identifierExpression(lexicalIdentifier("X")),
          lexicalIdentifier("Y"),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
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
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        patternMatchingStatement(
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("X")),
            identifierExpression(lexicalIdentifier("X")),
          ),
          lexicalIdentifier("Y"),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(execute(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("x", 0)),
      );
    });
  });
});
