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
  valueAtom,
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
import { errorException } from "../../../app/oz/machine/exceptions";
import { buildSystemExceptionState } from "../helpers";

describe("Reducing {Float ...} builtin statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handled float division correctly", () => {
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
        lexicalRecordSelection("Float", literalAtom("/")),
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
          buildEquivalenceClass(valueNumber(1.5), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled error when arguments in flaot division are not numbers", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueAtom(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Float", literalAtom("/")),
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

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException()),
    );
  });

  it("handled float division by zero correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
        buildEquivalenceClass(valueNumber(0), buildVariable("b", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      procedureApplicationStatement(
        lexicalRecordSelection("Float", literalAtom("/")),
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

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException()),
    );
  });

  it("handled number multipication as built in correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("/", "Float"),
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
          buildEquivalenceClass(valueNumber(1.5), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("/", "Float"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });
});
