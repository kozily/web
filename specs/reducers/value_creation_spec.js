import Immutable from "immutable";
import { skipStatement, valueCreationStatement } from "../samples/statements";
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
import reduce from "../../app/oz/reducers/value_creation";

describe("Reducing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when value is a number", () => {
    it("when variable is unbound", () => {
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
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              literalNumber(155),
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

    it("when variable is bound to the same value", () => {
      const state = buildState(
        buildStack(buildSemanticStatement(skipStatement())),
        buildStore(
          buildEquivalenceClass(
            literalNumber(155),
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
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              literalNumber(155),
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

    it("when variable is bound to a different value", () => {
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
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrowError(
        "Incompatible values 24 and 155",
      );
    });
  });

  describe("when value is a record", () => {
    describe("when variable is bound to a compatible value", () => {
      it("with same labels, same features and same values in features", () => {
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
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", { name: lexicalIdentifier("Y") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Y: buildVariable("y", 0),
          }),
        );

        expect(reduce(state, statement)).toEqual(
          buildState(
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
          ),
        );
      });

      it("with same labels, same features and different values in features", () => {
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
            buildEquivalenceClass(undefined, buildVariable("w", 0)),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", { name: lexicalIdentifier("W") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            W: buildVariable("w", 0),
          }),
        );

        expect(reduce(state, statement)).toEqual(
          buildState(
            buildStack(buildSemanticStatement(skipStatement())),
            buildStore(
              buildEquivalenceClass(
                literalRecord("person", { name: buildVariable("y", 0) }), //TODO remains y or w?
                buildVariable("x", 0),
                buildVariable("x", 1),
              ),
              buildEquivalenceClass(
                undefined,
                buildVariable("y", 0),
                buildVariable("y", 1),
                buildVariable("w", 0),
              ),
            ),
          ),
        );
      });

      it("recursive", () => {
        const state = buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              literalRecord("person", { address: buildVariable("y", 0) }),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              literalRecord("address", { street: buildVariable("a", 0) }),
              buildVariable("y", 0),
            ),
            buildEquivalenceClass(
              literalRecord("address", { street: buildVariable("b", 0) }),
              buildVariable("p", 0),
            ),
            buildEquivalenceClass(
              undefined,
              buildVariable("a", 0),
              buildVariable("b", 0),
            ),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", { address: lexicalIdentifier("P") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            P: buildVariable("p", 0),
          }),
        );

        expect(reduce(state, statement)).toEqual(
          buildState(
            buildStack(buildSemanticStatement(skipStatement())),
            buildStore(
              buildEquivalenceClass(
                literalRecord("person", { address: buildVariable("y", 0) }),
                buildVariable("x", 0),
                buildVariable("x", 1),
              ),
              buildEquivalenceClass(
                literalRecord("address", { street: buildVariable("a", 0) }),
                buildVariable("y", 0),
                buildVariable("p", 0),
              ),
              buildEquivalenceClass(
                undefined,
                buildVariable("a", 0),
                buildVariable("b", 0),
              ),
            ),
          ),
        );
      });
    });

    describe("when variable is bound to an incompatible value", () => {
      it("with different type", () => {
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
          valueCreationStatement(lexicalIdentifier("X"), literalNumber(155)),
          buildEnvironment({
            X: buildVariable("x", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrowError(
          "Incompatible value types record and number",
        );
      });

      it("with same label, same features and different value in features", () => {
        const state = buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              literalRecord("person", { name: buildVariable("y", 0) }),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              literalNumber(10),
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
            buildEquivalenceClass(literalNumber(24), buildVariable("z", 0)),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", { name: lexicalIdentifier("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrowError(
          "Incompatible values 10 and 24",
        );
      });

      it("with same label, different features", () => {
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
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", { lastname: lexicalIdentifier("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrowError(
          "Incompatible features name and lastname",
        );
      });

      it("with same label, different amount of features", () => {
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
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("person", {
              name: lexicalIdentifier("Y"),
              lastname: lexicalIdentifier("Z"),
            }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Y: buildVariable("y", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrowError(
          "Incompatible features name and name,lastname",
        );
      });

      it("with different labels", () => {
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
            buildEquivalenceClass(literalNumber(24), buildVariable("z", 0)),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalIdentifier("X"),
            literalRecord("address", { street: lexicalIdentifier("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrowError(
          "Incompatible labels person and address",
        );
      });
    });
  });
});
