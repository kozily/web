import Immutable from "immutable";
import {
  skipStatement,
  byNeedStatement,
  procedureApplicationStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
  literalExpression,
} from "../../app/oz/machine/expressions";
import { literalAtom } from "../../app/oz/machine/literals";
import { valueNumber } from "../../app/oz/machine/values";
import { buildBlockedState } from "./helpers";
import {
  buildState,
  buildSingleThreadedState,
  buildThread,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildTau,
  buildTrigger,
  buildEnvironment,
} from "../../app/oz/machine/build";
import { getLastEnvironmentIndex } from "../../app/oz/machine/environment";
import reduce from "../../app/oz/execution/by_need";

describe("Reducing by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a trigger when Y is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("w", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      byNeedStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("W"),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        W: buildVariable("w", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: state.get("sigma"),
        tau: buildTau(
          buildTrigger(
            buildVariable("x", 0),
            "TriggerProcedure",
            buildVariable("w", 0),
            "W",
          ),
        ),
      }),
    );
  });

  it("activates a trigger when Y is bound", () => {
    const lastIndex = getLastEnvironmentIndex();
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement(), buildEnvironment(), {
          environmentIndex: lastIndex,
        }),
      ],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("w", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      byNeedStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("W"),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        W: buildVariable("w", 0),
      }),
      { environmentIndex: lastIndex },
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [
              buildSemanticStatement(skipStatement(), buildEnvironment(), {
                environmentIndex: lastIndex,
              }),
            ],
          }),

          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                procedureApplicationStatement(
                  identifierExpression(lexicalIdentifier("TriggerProcedure")),
                  [identifierExpression(lexicalIdentifier("W"))],
                ),
                buildEnvironment({
                  TriggerProcedure: buildVariable("x", 0),
                  W: buildVariable("w", 0),
                }),
                { environmentIndex: lastIndex + 1 },
              ),
            ],
          }),
        ],
        sigma: state.get("sigma"),
        tau: state.get("tau"),
      }),
    );
  });

  it("blocks the current thread when the procedure expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("w", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      byNeedStatement(
        operatorExpression(
          ".",
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalAtom("trigger")),
        ),
        lexicalIdentifier("W"),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        W: buildVariable("w", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });
});
