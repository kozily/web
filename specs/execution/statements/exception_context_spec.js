import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  exceptionContextStatement,
  exceptionCatchStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { getLastEnvironmentIndex } from "../../../app/oz/machine/environment";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";

describe("Reducing try statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("pushes the appropriate statements on the stack", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionContextStatement(
        sequenceStatement(skipStatement(), skipStatement()),
        lexicalIdentifier("Error"),
        bindingStatement(
          identifierExpression(lexicalIdentifier("Error")),
          identifierExpression(lexicalIdentifier("X")),
        ),
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
          buildSemanticStatement(
            exceptionCatchStatement(
              lexicalIdentifier("Error"),
              bindingStatement(
                identifierExpression(lexicalIdentifier("Error")),
                identifierExpression(lexicalIdentifier("X")),
              ),
            ),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ],

        sigma: state.get("sigma"),
      }),
    );
  });

  it("pushes the appropriate statements keeping the environment index", () => {
    const lastIndex = getLastEnvironmentIndex();
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement(), buildEnvironment(), {
          environmentIndex: lastIndex,
        }),
      ],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionContextStatement(
        sequenceStatement(skipStatement(), skipStatement()),
        lexicalIdentifier("Error"),
        bindingStatement(
          identifierExpression(lexicalIdentifier("Error")),
          identifierExpression(lexicalIdentifier("X")),
        ),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
      { environmentIndex: lastIndex },
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
            { environmentIndex: lastIndex },
          ),
          buildSemanticStatement(
            exceptionCatchStatement(
              lexicalIdentifier("Error"),
              bindingStatement(
                identifierExpression(lexicalIdentifier("Error")),
                identifierExpression(lexicalIdentifier("X")),
              ),
            ),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
            { environmentIndex: lastIndex },
          ),
          buildSemanticStatement(skipStatement(), buildEnvironment(), {
            environmentIndex: lastIndex,
          }),
        ],

        sigma: state.get("sigma"),
      }),
    );
  });
});
