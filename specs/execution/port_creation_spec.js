import Immutable from "immutable";
import {
  portCreationStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { buildSystemExceptionState } from "./helpers";
import { failureException } from "../../app/oz/machine/exceptions";
import { valueNumber, valueMutableVariable } from "../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  buildMu,
  buildMutableMapping,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/port_creation";

describe("Reducing port creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("raises a failure when the port is already bound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      portCreationStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, failureException()),
    );
  });

  it("executes correctly when the expression evaluates to a variable", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      portCreationStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(
            valueMutableVariable("port", 0),
            buildVariable("y", 0),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("port", 0),
            buildVariable("x", 0),
          ),
        ),
      }),
    );
  });
});
