import Immutable from "immutable";
import {
  nameCreationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { failureException } from "../../../app/oz/machine/exceptions";
import { valueNumber, valueNameCreation } from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../../app/oz/machine/build";
import { buildSystemExceptionState } from "./helpers";
import { execute } from "../../../app/oz/execution";

describe("Reducing new name statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("raises a failure when the argument does not match", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      nameCreationStatement(lexicalIdentifier("Y")),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, failureException()),
    );
  });

  it("executes correctly when the expression is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      nameCreationStatement(lexicalIdentifier("Y")),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    const sameValue = valueNameCreation();
    const compareValueNewName = sameValue.update(
      "name",
      oldName => oldName + 1,
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(compareValueNewName, buildVariable("y", 0)),
        ),
      }),
    );
  });
});
