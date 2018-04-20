import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  patternMatchingStatement,
} from "../../app/oz/machine/statements";
import { buildBlockedState } from "./helpers";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber, literalRecord } from "../../app/oz/machine/literals";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/pattern_matching";

describe("Reducing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("when pattern matches", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          literalRecord("person", {
            name: buildVariable("n", 0),
            age: buildVariable("a", 0),
          }),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("n", 0)),
        buildEquivalenceClass(undefined, buildVariable("a", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person", {
          name: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
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
              X: buildVariable("x", 0),
              Name: buildVariable("n", 0),
              Age: buildVariable("a", 0),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });

  it("when pattern matches with no features", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(literalRecord("person"), buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person"),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
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
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });

  it("when pattern does not match due to wrong features", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          literalRecord("person", {
            name: buildVariable("n", 0),
            age: buildVariable("a", 0),
          }),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("n", 0)),
        buildEquivalenceClass(undefined, buildVariable("a", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person", {
          names: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            skipStatement(),
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

  it("when pattern does not match due to wrong label", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          literalRecord("people", {
            name: buildVariable("n", 0),
            age: buildVariable("a", 0),
          }),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("n", 0)),
        buildEquivalenceClass(undefined, buildVariable("a", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person", {
          name: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            skipStatement(),
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

  it("when pattern does not match due to variable not being a record", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(literalNumber(2), buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person", {
          name: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            skipStatement(),
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

  it("when the case identifier is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        literalRecord("person"),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
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
