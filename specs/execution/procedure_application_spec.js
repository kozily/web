import Immutable from "immutable";
import {
  skipStatement,
  procedureApplicationStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  valueProcedure,
  valueNumber,
  valueBuiltIn,
} from "../../app/oz/machine/values";
import {
  errorException,
  failureException,
} from "../../app/oz/machine/exceptions";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/procedure_application";

describe("Reducing {X ...} statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when a procedure value is used", () => {
    it("executes simple functional procedures correctly", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
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
      });

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

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              skipStatement(),
              buildEnvironment({
                I: buildVariable("x", 0),
                O: buildVariable("y", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });

    it("executes procedure values with closure and arguments correctly", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
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
      });

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

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [
            buildSemanticStatement(
              skipStatement(),
              buildEnvironment({
                Input: buildVariable("y", 0),
                Output: buildVariable("z", 0),
                ClosureValue: buildVariable("c", 0),
              }),
            ),
            buildSemanticStatement(skipStatement()),
          ],
          sigma: state.get("sigma"),
        }),
      );
    });

    it("fails if a procedure is called with the wrong number of arguments", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueProcedure(
              [lexicalIdentifier("Input"), lexicalIdentifier("Output")],
              skipStatement(),
            ),
            buildVariable("x", 0),
          ),

          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X"), [
          lexicalIdentifier("Y"),
        ]),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });
  });

  describe("when a built-in procedure is used", () => {
    it("binds the appropriate value if the call is successful", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueBuiltIn("+", "Number"),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
          buildEquivalenceClass(valueNumber(10), buildVariable("z", 0)),
          buildEquivalenceClass(undefined, buildVariable("r", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X"), [
          lexicalIdentifier("Y"),
          lexicalIdentifier("Z"),
          lexicalIdentifier("R"),
        ]),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
          Z: buildVariable("z", 0),
          R: buildVariable("r", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [buildSemanticStatement(skipStatement())],
          sigma: buildSigma(
            buildEquivalenceClass(
              valueBuiltIn("+", "Number"),
              buildVariable("x", 0),
            ),
            buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
            buildEquivalenceClass(valueNumber(10), buildVariable("z", 0)),
            buildEquivalenceClass(valueNumber(15), buildVariable("r", 0)),
          ),
        }),
      );
    });

    it("fails if the amount of arguments is empty", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueBuiltIn("+", "Number"),
            buildVariable("x", 0),
          ),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X")),
        buildEnvironment({
          X: buildVariable("x", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("fails if the built-in-specific validations fail", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueBuiltIn("/", "Float"),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
          buildEquivalenceClass(valueNumber(0), buildVariable("z", 0)),
          buildEquivalenceClass(undefined, buildVariable("r", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X"), [
          lexicalIdentifier("Y"),
          lexicalIdentifier("Z"),
          lexicalIdentifier("R"),
        ]),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
          Z: buildVariable("z", 0),
          R: buildVariable("r", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("fails if the calculated value can't be binded to the result variable", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueBuiltIn("+", "Number"),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
          buildEquivalenceClass(valueNumber(10), buildVariable("z", 0)),
          buildEquivalenceClass(valueNumber(7), buildVariable("r", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X"), [
          lexicalIdentifier("Y"),
          lexicalIdentifier("Z"),
          lexicalIdentifier("R"),
        ]),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
          Z: buildVariable("z", 0),
          R: buildVariable("r", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, failureException()),
      );
    });

    it("blocks the current thread if any of the required arguments are unbound", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueBuiltIn("+", "Number"),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(5), buildVariable("y", 0)),
          buildEquivalenceClass(undefined, buildVariable("z", 0)),
          buildEquivalenceClass(undefined, buildVariable("r", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(lexicalIdentifier("X"), [
          lexicalIdentifier("Y"),
          lexicalIdentifier("Z"),
          lexicalIdentifier("R"),
        ]),
        buildEnvironment({
          X: buildVariable("x", 0),
          Y: buildVariable("y", 0),
          Z: buildVariable("z", 0),
          R: buildVariable("r", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildBlockedState(state, statement, 0, buildVariable("z", 0)),
      );
    });
  });

  it("blocks the thread if the procedure identifier is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("p", 0)),
        buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

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

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("p", 0)),
    );
  });

  it("fails if a non-callable value is called", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(valueNumber(155), buildVariable("p", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("P")),
      buildEnvironment({
        P: buildVariable("p", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException()),
    );
  });
});
