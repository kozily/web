import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  patternMatchingStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import { literalNumber, literalRecord } from "../samples/literals";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
  buildStore,
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
    const state = buildState(
      buildStack(),
      buildStore(
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
    );

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

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            buildEnvironment({
              X: buildVariable("x", 0),
              Name: buildVariable("n", 0),
              Age: buildVariable("a", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("when pattern matches with no features", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(literalRecord("person"), buildVariable("x", 0)),
      ),
    );

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

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("when pattern does not match due to wrong features", () => {
    const state = buildState(
      buildStack(),
      buildStore(
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
    );

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

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("when pattern does not match due to wrong label", () => {
    const state = buildState(
      buildStack(),
      buildStore(
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
    );

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

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("when pattern does not match due to variable not being a record", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(literalNumber(2), buildVariable("x", 0)),
      ),
    );

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

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });
});
