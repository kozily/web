import Immutable from "immutable";
import {
  skipStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import {
  lexicalIdentifier,
  lexicalRecordSelection,
} from "../../../app/oz/machine/lexical";
import { literalAtom } from "../../../app/oz/machine/literals";
import {
  valueNumber,
  valueBuiltIn,
  valueBoolean,
} from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import reduce from "../../../app/oz/execution/procedure_application";

describe("Reducing {Value ...} builtin statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handled false correctly value equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("==")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("==", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("==", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("==")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("==", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("==", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false correctly value non equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("\\=")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value non equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("\\=", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("\\=", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value non equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("\\=")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value non equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("\\=", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("\\=", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false correctly value less than or equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("=<")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value less than or equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("=<", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("=<", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value less than or equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("=<")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value less than or equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("=<", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("=<", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(20), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false correctly value less than comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("<")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value less than comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("<", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("<", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value less than comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom("<")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value less than comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("<", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("<", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false correctly value greater than or equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom(">=")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value greater than or equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn(">=", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn(">=", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value greater than or equal comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom(">=")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value greater than or equal comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn(">=", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn(">=", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false correctly value greater than comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom(">")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled false value greater than comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn(">", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(true), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn(">", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true correctly value greater than comparison between numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Value", literalAtom(">")),
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          lexicalIdentifier("C"),
        ],
      ),
      buildEnvironment({
        C: buildVariable("c", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    const result = reduce(state, statement, 0);
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled true value greater than comparison between numbers as builtin values", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn(">", "Value"),
          buildVariable("o", 0),
        ),
        buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(lexicalIdentifier("O"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
        lexicalIdentifier("C"),
      ]),
      buildEnvironment({
        C: buildVariable("c", 0),
        O: buildVariable("o", 0),
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueBoolean(false), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn(">", "Value"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(19), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });
});
