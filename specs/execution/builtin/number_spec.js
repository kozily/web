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
import { valueNumber, valueBuiltIn } from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import reduce from "../../../app/oz/execution/procedure_application";

describe("Reducing {Number ...} builtin statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handled numberplus correctly", () => {
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
        lexicalRecordSelection("Number", literalAtom("+")),
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
    // eslint-disable-next-line no-console
    console.log(result.toString());
    expect(result).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(50), buildVariable("c", 0)),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });

  it("handled number plus as built in correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("c", 0)),
        buildEquivalenceClass(
          valueBuiltIn("+", "Number"),
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
          buildEquivalenceClass(valueNumber(50), buildVariable("c", 0)),
          buildEquivalenceClass(
            valueBuiltIn("+", "Number"),
            buildVariable("o", 0),
          ),
          buildEquivalenceClass(valueNumber(30), buildVariable("a", 0)),
          buildEquivalenceClass(valueNumber(20), buildVariable("b", 0)),
        ),
      }),
    );
  });
});
