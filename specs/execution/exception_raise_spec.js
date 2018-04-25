import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  exceptionRaiseStatement,
  exceptionCatchStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
} from "../../app/oz/machine/expressions";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/exception_raise";
import { failureException } from "../../app/oz/machine/exceptions";
import { buildBlockedState } from "./helpers";

describe("Reducing raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when there is a catch statement in the stack", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(
          exceptionCatchStatement(
            lexicalIdentifier("Error"),
            sequenceStatement(skipStatement(), skipStatement()),
          ),
          buildEnvironment({
            Y: buildVariable("y", 0),
          }),
        ),
      ],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionRaiseStatement(identifierExpression(lexicalIdentifier("X"))),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            buildEnvironment({
              Error: buildVariable("x", 0),
              Y: buildVariable("y", 0),
            }),
          ),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });

  it("throws an error when there is no catch statement on the stack", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
      ],
      sigma: buildSigma(
        buildEquivalenceClass(
          failureException("Message"),
          buildVariable("x", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionRaiseStatement(identifierExpression(lexicalIdentifier("X"))),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(() => reduce(state, statement, 0)).toThrowMatching(error => {
      return (
        error.message === "Uncaught exception" &&
        Immutable.is(error.innerOzException, failureException("Message"))
      );
    });
  });

  it("blocks when the exception expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
        buildSemanticStatement(skipStatement()),
      ],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionRaiseStatement(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("X")),
        ),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });
});
