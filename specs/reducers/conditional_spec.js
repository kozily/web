import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  bindingStatement,
  conditionalStatement,
} from "../samples/statements";
import {
  lexicalVariable,
  lexicalNumber,
  lexicalRecord,
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
import reduce from "../../app/oz/reducers/conditional";

describe("Reducing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when value is not valid", () => {
    it("error when variable is unbound", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrowError(
        "Unbound value in if condition",
      );
    });

    it("error when variable is number", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            lexicalNumber(24),
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrowError(
        "Wrong type in if condition [type: number]",
      );
    });

    it("error when variable is a record with features", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            lexicalRecord("person", { name: buildVariable("y", 0) }),
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrowError(
        "The condition record must not have features",
      );
    });

    it("error when variable is a record with no features wrong label", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            lexicalRecord("person"),
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrowError(
        "Unexpected record label in if condition [label: person]",
      );
    });
  });

  describe("when value is valid", () => {
    it("when variable is true", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            lexicalRecord("true"),
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      /*
      if X then Y=84 else Y=345 end
      */
      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          bindingStatement(lexicalVariable("Y"), lexicalNumber(84)),
          bindingStatement(lexicalVariable("Y"), lexicalNumber(345)),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(
            buildSemanticStatement(
              bindingStatement(lexicalVariable("Y"), lexicalNumber(84)),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ),
          buildStore(
            buildEquivalenceClass(
              lexicalRecord("true"),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              undefined,
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
          ),
        ),
      );
    });

    it("when variable is false", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            lexicalRecord("false"),
            buildVariable("x", 0),
            buildVariable("x", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
        ),
      );

      /*
      if X then Y=84 else Y=345 end
      */
      const statement = buildSemanticStatement(
        conditionalStatement(
          lexicalVariable("X"),
          bindingStatement(lexicalVariable("Y"), lexicalNumber(84)),
          bindingStatement(lexicalVariable("Y"), lexicalNumber(345)),
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(
            buildSemanticStatement(
              bindingStatement(lexicalVariable("Y"), lexicalNumber(345)),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ),
          buildStore(
            buildEquivalenceClass(
              lexicalRecord("false"),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              undefined,
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
          ),
        ),
      );
    });
  });
});
