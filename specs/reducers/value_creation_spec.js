import Immutable from "immutable";
import { skipStatement, valueCreationStatement } from "../samples/statements";
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
import reduce from "../../app/oz/reducers/binding";

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
        valueCreationStatement(lexicalVariable("X"), lexicalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              lexicalNumber(155),
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
            lexicalNumber(155),
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
        valueCreationStatement(lexicalVariable("X"), lexicalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement)).toEqual(
        buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              lexicalNumber(155),
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
        valueCreationStatement(lexicalVariable("X"), lexicalNumber(155)),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(() => reduce(state, statement)).toThrow("Uncompatible values");
    });
  });

  describe("when value is a record", () => {
    describe("when variable is bound to a compatible value", () => {
      it("with same labels, same features and same values in features", () => {
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
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("person", { name: lexicalVariable("Y") }),
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
          ),
        );
      });

      it("with same labels, same features and different values in features", () => {
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
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("person", { name: lexicalVariable("W") }),
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
                lexicalRecord("person", { name: buildVariable("y", 0) }), //TODO remains y or w?
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
              lexicalRecord("person", { address: buildVariable("y", 0) }),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              lexicalRecord("address", { street: buildVariable("a", 0) }),
              buildVariable("y", 0),
            ),
            buildEquivalenceClass(
              lexicalRecord("address", { street: buildVariable("b", 0) }),
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
            lexicalVariable("X"),
            lexicalRecord("person", { address: lexicalVariable("P") }),
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
                lexicalRecord("person", { address: buildVariable("y", 0) }),
                buildVariable("x", 0),
                buildVariable("x", 1),
              ),
              buildEquivalenceClass(
                lexicalRecord("address", { street: buildVariable("a", 0) }),
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
          valueCreationStatement(lexicalVariable("X"), lexicalNumber(155)),
          buildEnvironment({
            X: buildVariable("x", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrow("Uncompatible values");
      });

      it("with same label, same features and different value in features", () => {
        const state = buildState(
          buildStack(buildSemanticStatement(skipStatement())),
          buildStore(
            buildEquivalenceClass(
              lexicalRecord("person", { name: buildVariable("y", 0) }),
              buildVariable("x", 0),
              buildVariable("x", 1),
            ),
            buildEquivalenceClass(
              lexicalNumber(10),
              buildVariable("y", 0),
              buildVariable("y", 1),
            ),
            buildEquivalenceClass(lexicalNumber(24), buildVariable("z", 0)),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("person", { name: lexicalVariable("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrow("Uncompatible values");
      });

      it("with same label, different features", () => {
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
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("person", { lastname: lexicalVariable("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrow("Uncompatible values");
      });

      it("with same label, different amount of features", () => {
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
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("person", {
              name: lexicalVariable("Y"),
              lastname: lexicalVariable("Z"),
            }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Y: buildVariable("y", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrow("Uncompatible values");
      });

      it("with different labels", () => {
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
            buildEquivalenceClass(lexicalNumber(24), buildVariable("z", 0)),
          ),
        );

        const statement = buildSemanticStatement(
          valueCreationStatement(
            lexicalVariable("X"),
            lexicalRecord("address", { street: lexicalVariable("Z") }),
          ),
          buildEnvironment({
            X: buildVariable("x", 0),
            Z: buildVariable("z", 0),
          }),
        );

        expect(() => reduce(state, statement)).toThrow("Uncompatible values");
      });
    });
  });
});
