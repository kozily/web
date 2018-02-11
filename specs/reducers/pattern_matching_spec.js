import Immutable from "immutable";
import {
  skipStatement,
  bindingStatement,
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

describe("Reducing case X of person(name:Name age:Age) then Z = Age else skip end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly and execute the true statement", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
        buildEquivalenceClass(
          lexicalRecord("person", { name: undefined, age: undefined }),
          buildVariable("x", 0),
        ),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
        }),
        bindingStatement(lexicalVariable("Z"), lexicalVariable("Age")),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            bindingStatement(lexicalVariable("Z"), lexicalVariable("Age")),
            buildEnvironment({
              X: buildVariable("x", 0),
              Z: buildVariable("z", 0),
              Name: buildVariable("name", 0),
              Age: buildVariable("age", 0),
            }),
          ),
        ),
        buildStore(
          buildEquivalenceClass(undefined, buildVariable("z", 0)),
          buildEquivalenceClass(
            lexicalRecord("person", { name: undefined, age: undefined }),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(undefined, buildVariable("name", 0)),
          buildEquivalenceClass(undefined, buildVariable("age", 0)),
        ),
      ),
    );
  });

  it("reduces correctly and execute the false statement when differs in a feature key", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
        buildEquivalenceClass(
          lexicalRecord("person", { name: undefined, ages: undefined }),
          buildVariable("x", 0),
        ),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
        }),
        bindingStatement(lexicalVariable("Z"), lexicalVariable("Age")),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
              Z: buildVariable("z", 0),
            }),
          ),
        ),
        buildStore(
          buildEquivalenceClass(undefined, buildVariable("z", 0)),
          buildEquivalenceClass(
            lexicalRecord("person", { name: undefined, ages: undefined }),
            buildVariable("x", 0),
          ),
        ),
      ),
    );
  });

  it("reduces correctly and execute the false statement when differs in a label", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
        buildEquivalenceClass(
          lexicalRecord("persona", { name: undefined, age: undefined }),
          buildVariable("x", 0),
        ),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
        }),
        bindingStatement(lexicalVariable("Z"), lexicalVariable("Age")),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              X: buildVariable("x", 0),
              Z: buildVariable("z", 0),
            }),
          ),
        ),
        buildStore(
          buildEquivalenceClass(undefined, buildVariable("z", 0)),
          buildEquivalenceClass(
            lexicalRecord("persona", { name: undefined, age: undefined }),
            buildVariable("x", 0),
          ),
        ),
      ),
    );
  });

  it("can not reduce when the variable in case is not a record", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
        buildEquivalenceClass(lexicalNumber(11), buildVariable("x", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      patternMatchingStatement(
        lexicalVariable("X"),
        lexicalRecord("person", {
          name: lexicalVariable("Name"),
          age: lexicalVariable("Age"),
        }),
        bindingStatement(lexicalVariable("Z"), lexicalVariable("Age")),
        skipStatement(),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(() => reduce(state, statement)).toThrowError(
      "Wrong type in case statement [type: number]",
    );
  });
});
