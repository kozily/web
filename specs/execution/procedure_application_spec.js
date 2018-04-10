import Immutable from "immutable";
import {
  skipStatement,
  procedureApplicationStatement,
} from "../../app/oz/machine/statements";
import {
  lexicalIdentifier,
  lexicalRecordSelection,
} from "../../app/oz/machine/lexical";
import { literalAtom } from "../../app/oz/machine/literals";
import {
  valueProcedure,
  valueNumber,
  valueRecord,
} from "../../app/oz/machine/values";
import { errorException } from "../../app/oz/machine/exceptions";
import { buildSystemExceptionState } from "./helpers";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildThreadMetadata,
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

  it("Executes procedure values with closure and arguments correctly", () => {
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

  it("fails if a non-procedure value is called", () => {
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
      buildSingleThreadedState({
        threadMetadata: buildThreadMetadata({ status: "blocked" }),
        semanticStatements: [
          statement,
          buildSemanticStatement(skipStatement()),
        ],
        sigma: state.get("sigma"),
      }),
    );
  });

  it("Executes builtIn sum procedure correctly", () => {
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

  describe("Reducing {X ...} recordSelection statements", () => {
    it("handled correctly", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("c", 0)),
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueRecord("age"), buildVariable("f", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("F"),
            lexicalIdentifier("C"),
          ],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          C: buildVariable("c", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSingleThreadedState({
          semanticStatements: [],
          sigma: buildSigma(
            buildEquivalenceClass(valueRecord("age"), buildVariable("f", 0)),
            buildEquivalenceClass(
              valueRecord("person", { age: buildVariable("a", 0) }),
              buildVariable("x", 0),
            ),
            buildEquivalenceClass(
              valueNumber(30),
              buildVariable("a", 0),
              buildVariable("c", 0),
            ),
          ),
        }),
      );
    });

    it("Handled error in argument size ", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueRecord("age"), buildVariable("f", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [lexicalIdentifier("X"), lexicalIdentifier("F")],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("Handled error first argument undefined", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("c", 0)),
          buildEquivalenceClass(valueRecord("age"), buildVariable("f", 0)),
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("F"),
            lexicalIdentifier("C"),
          ],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          C: buildVariable("c", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("Handled error second argument undefined", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("c", 0),
            buildVariable("f", 0),
          ),
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("F"),
            lexicalIdentifier("C"),
          ],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          C: buildVariable("c", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("Handled error first argument not a record", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("c", 0),
            buildVariable("f", 0),
          ),
          buildEquivalenceClass(valueNumber(40), buildVariable("x", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("F"),
            lexicalIdentifier("C"),
          ],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          C: buildVariable("c", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });

    it("Handled error second argument not an atom", () => {
      const state = buildSingleThreadedState({
        semanticStatements: [],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("c", 0)),
          buildEquivalenceClass(
            valueRecord("person", { age: buildVariable("a", 0) }),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("f", 0)),
        ),
      });

      const statement = buildSemanticStatement(
        procedureApplicationStatement(
          lexicalRecordSelection("Record", literalAtom(".")),
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("F"),
            lexicalIdentifier("C"),
          ],
        ),
        buildEnvironment({
          X: buildVariable("x", 0),
          A: buildVariable("a", 0),
          C: buildVariable("c", 0),
          F: buildVariable("f", 0),
        }),
      );

      expect(reduce(state, statement, 0)).toEqual(
        buildSystemExceptionState(state, 0, errorException()),
      );
    });
  });
});
