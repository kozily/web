import Immutable from "immutable";
import {
  skipStatement,
  byNeedStatement,
  procedureApplicationStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { valueNumber } from "../../app/oz/machine/values";
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
import reduce from "../../app/oz/execution/by_need";

describe("Reducing by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("when Y is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      byNeedStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: state.get("sigma"),
        tau: buildTau(
          buildTrigger(buildVariable("x", 0), buildVariable("y", 0)),
        ),
      }),
    );
  });

  it("when Y is bound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      byNeedStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [buildSemanticStatement(skipStatement())],
          }),

          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                procedureApplicationStatement(lexicalIdentifier("X"), [
                  lexicalIdentifier("Y"),
                ]),
                statement.get("environment"),
              ),
            ],
          }),
        ],
        sigma: state.get("sigma"),
        tau: state.get("tau"),
      }),
    );
  });
});
