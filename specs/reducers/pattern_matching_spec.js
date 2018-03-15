import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  patternMatchingStatement,
} from "../samples/statements";
import {
  lexicalVariable,
  lexicalRecord,
  lexicalNumber,
} from "../samples/lexical";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
  buildStore,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/reducers/pattern_matching";

describe("Reducing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("when pattern matches", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(
          lexicalRecord("person", {
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
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
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
        buildEquivalenceClass(lexicalRecord("person"), buildVariable("x", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person"),
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
          lexicalRecord("person", {
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
        lexicalVariable("X"),
        lexicalRecord("person", {
          names: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
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
          lexicalRecord("people", {
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
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
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
        buildEquivalenceClass(lexicalNumber(2), buildVariable("x", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
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
