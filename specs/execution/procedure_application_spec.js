import Immutable from "immutable";
import {
  skipStatement,
  procedureApplicationStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import { valueProcedure, valueNumber } from "../samples/values";
import {
  buildState,
  buildStack,
  buildSemanticStatement,
  buildStore,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/procedure_application";

describe("Reducing {X ...} statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Executes simple functional procedures correctly", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("I"), lexicalIdentifier("O")],
            skipStatement(),
          ),
          buildVariable("p", 0),
        ),
        buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("P"), [
        lexicalIdentifier("X"),
        lexicalIdentifier("Y"),
      ]),
      buildEnvironment({
        P: buildVariable("p", 0),
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              I: buildVariable("x", 0),
              O: buildVariable("y", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("Executes procedure values with closure and arguments correctly", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("Input"), lexicalIdentifier("Output")],
            skipStatement(),
            {
              ClosureValue: buildVariable("c", 0),
            },
          ),
          buildVariable("x", 0),
        ),

        buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),

        buildEquivalenceClass(valueNumber(7), buildVariable("z", 0)),

        buildEquivalenceClass(undefined, buildVariable("c", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("X"), [
        lexicalIdentifier("Y"),
        lexicalIdentifier("Z"),
      ]),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState(
        buildStack(
          buildSemanticStatement(
            skipStatement(),
            buildEnvironment({
              Input: buildVariable("y", 0),
              Output: buildVariable("z", 0),
              ClosureValue: buildVariable("c", 0),
            }),
          ),
        ),
        state.get("store"),
      ),
    );
  });

  it("fails if a non-procedure value is called", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(valueNumber(155), buildVariable("p", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("P")),
      buildEnvironment({
        P: buildVariable("p", 0),
      }),
    );

    expect(() => reduce(state, statement)).toThrowError();
  });

  it("fails if a procedure is called with the wrong number of arguments", () => {
    const state = buildState(
      buildStack(),
      buildStore(
        buildEquivalenceClass(
          valueProcedure(
            [lexicalIdentifier("Input"), lexicalIdentifier("Output")],
            skipStatement(),
          ),
          buildVariable("x", 0),
        ),

        buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
      ),
    );

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("X"), [
        lexicalIdentifier("Y"),
      ]),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(() => reduce(state, statement)).toThrowError();
  });
});
