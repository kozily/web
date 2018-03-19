import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  patternMatchingStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import { valueNumber, valueRecord } from "../samples/values";
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
          valueRecord("person", {
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
        valueRecord("person", {
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
        buildEquivalenceClass(valueRecord("person"), buildVariable("x", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        valueRecord("person"),
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
          valueRecord("person", {
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
        valueRecord("person", {
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
          valueRecord("people", {
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
        valueRecord("person", {
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
      buildStore(buildEquivalenceClass(valueNumber(2), buildVariable("x", 0))),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        valueRecord("person", {
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
