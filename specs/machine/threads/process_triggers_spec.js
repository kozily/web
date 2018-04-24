import Immutable from "immutable";
import {
  skipStatement,
  valueCreationStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";
import { valueProcedure, valueNumber } from "../../../app/oz/machine/values";
import {
  buildState,
  buildSingleThreadedState,
  threadStatus,
  buildThreadMetadata,
  buildThread,
  buildVariable,
  buildTau,
  buildTrigger,
  buildSigma,
  buildEquivalenceClass,
  buildSemanticStatement,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { processTriggers } from "../../../app/oz/machine/threads";

describe("threads#processTriggers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("does not fail when there are no triggers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    expect(processTriggers(state)).toEqual(state);
  });

  it("does nothing when the trigger variable is unbound, and no thread needs the variable", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("O")],
            valueCreationStatement(lexicalIdentifier("O"), literalNumber(3)),
          ),
          buildVariable("p", 0),
        ),
      ),
      tau: buildTau(
        buildTrigger(
          buildVariable("p", 0),
          "TriggerProcedure",
          buildVariable("x", 0),
          "X",
        ),
      ),
    });

    expect(processTriggers(state)).toEqual(state);
  });

  it("activates the trigger when the trigger variable is bound even when no thread needs the variable", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(valueNumber(3), buildVariable("x", 0)),
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("O")],
            valueCreationStatement(lexicalIdentifier("O"), literalNumber(3)),
          ),
          buildVariable("p", 0),
        ),
      ),
      tau: buildTau(
        buildTrigger(
          buildVariable("p", 0),
          "TriggerProcedure",
          buildVariable("x", 0),
          "X",
        ),
      ),
    });

    expect(processTriggers(state)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [buildSemanticStatement(skipStatement())],
          }),
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                procedureApplicationStatement(
                  identifierExpression(lexicalIdentifier("TriggerProcedure")),
                  [identifierExpression(lexicalIdentifier("X"))],
                ),
                buildEnvironment({
                  TriggerProcedure: buildVariable("p", 0),
                  X: buildVariable("x", 0),
                }),
              ),
            ],
          }),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });

  it("activates the trigger when the trigger variable is needed by a thread", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      threadMetadata: buildThreadMetadata({
        status: threadStatus.blocked,
        waitCondition: buildVariable("x", 0),
      }),
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("O")],
            valueCreationStatement(lexicalIdentifier("O"), literalNumber(3)),
          ),
          buildVariable("p", 0),
        ),
      ),
      tau: buildTau(
        buildTrigger(
          buildVariable("p", 0),
          "TriggerProcedure",
          buildVariable("x", 0),
          "X",
        ),
      ),
    });

    expect(processTriggers(state)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [buildSemanticStatement(skipStatement())],
            metadata: buildThreadMetadata({
              status: threadStatus.blocked,
              waitCondition: buildVariable("x", 0),
            }),
          }),
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                procedureApplicationStatement(
                  identifierExpression(lexicalIdentifier("TriggerProcedure")),
                  [identifierExpression(lexicalIdentifier("X"))],
                ),
                buildEnvironment({
                  TriggerProcedure: buildVariable("p", 0),
                  X: buildVariable("x", 0),
                }),
              ),
            ],
          }),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });
});
