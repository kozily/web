import Immutable from "immutable";
import { skipStatement, localStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import { literalNumber } from "../samples/literals";
import {
  buildState,
  buildThread,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/local";

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
});
