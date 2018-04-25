import Immutable from "immutable";
import { skipStatement, localStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber } from "../../app/oz/machine/literals";
import {
  buildState,
  buildThread,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  buildSingleThreadedState,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/local";
import { getLastEnvironmentIndex } from "../../app/oz/machine/environment";

describe("Reducing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when the sigma is empty", () => {
    const state = buildState({
      threads: [buildThread()],
    });

    const statement = buildSemanticStatement(
      localStatement(lexicalIdentifier("X"), skipStatement()),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                skipStatement(),
                buildEnvironment({
                  X: buildVariable("x", 0),
                }),
              ),
            ],
          }),
        ],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
        ),
      }),
    );
  });

  it("reduces correctly when there are previous variables in the sigma", () => {
    const state = buildState({
      threads: [buildThread()],
      sigma: buildSigma(
        buildEquivalenceClass(literalNumber(10), buildVariable("y", 0)),
        buildEquivalenceClass(literalNumber(20), buildVariable("x", 0)),
        buildEquivalenceClass(literalNumber(30), buildVariable("x", 1)),
      ),
    });

    const statement = buildSemanticStatement(
      localStatement(lexicalIdentifier("X"), skipStatement()),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                skipStatement(),
                buildEnvironment({
                  Y: buildVariable("y", 0),
                  X: buildVariable("x", 2),
                }),
              ),
            ],
          }),
        ],

        sigma: buildSigma(
          buildEquivalenceClass(literalNumber(10), buildVariable("y", 0)),
          buildEquivalenceClass(literalNumber(20), buildVariable("x", 0)),
          buildEquivalenceClass(literalNumber(30), buildVariable("x", 1)),
          buildEquivalenceClass(undefined, buildVariable("x", 2)),
        ),
      }),
    );
  });

  it("reduces incrementing the environment index", () => {
    const lastIndex = getLastEnvironmentIndex();
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement(), buildEnvironment(), {
          environmentIndex: lastIndex,
        }),
      ],
    });

    const statement = buildSemanticStatement(
      localStatement(lexicalIdentifier("X"), skipStatement()),
      buildEnvironment(),
      { environmentIndex: lastIndex },
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                skipStatement(),
                buildEnvironment({
                  X: buildVariable("x", 0),
                }),
                { environmentIndex: lastIndex + 1 },
              ),
              buildSemanticStatement(skipStatement(), buildEnvironment(), {
                environmentIndex: lastIndex,
              }),
            ],
          }),
        ],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
        ),
      }),
    );
  });
});
