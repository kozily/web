import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  bindingStatement,
  conditionalStatement,
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
import reduce from "../../app/oz/execution/conditional";

describe("Reducing if statements", () => {
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
          lexicalIdentifier("X"),
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
            literalNumber(24),
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
          lexicalIdentifier("X"),
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
            literalRecord("person", { name: buildVariable("y", 0) }),
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
          lexicalIdentifier("X"),
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
            literalRecord("person"),
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
          lexicalIdentifier("X"),
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
            literalRecord("true"),
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
          lexicalIdentifier("X"),
          bindingStatement(lexicalIdentifier("Y"), literalNumber(84)),
          bindingStatement(lexicalIdentifier("Y"), literalNumber(345)),
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
              bindingStatement(lexicalIdentifier("Y"), literalNumber(84)),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ),
          buildStore(
            buildEquivalenceClass(
              literalRecord("true"),
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
            literalRecord("false"),
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
          lexicalIdentifier("X"),
          bindingStatement(lexicalIdentifier("Y"), literalNumber(84)),
          bindingStatement(lexicalIdentifier("Y"), literalNumber(345)),
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
              bindingStatement(lexicalIdentifier("Y"), literalNumber(345)),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ),
          buildStore(
            buildEquivalenceClass(
              literalRecord("false"),
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
