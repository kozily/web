import Immutable from "immutable";
import {
  cellCreationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
import { failureException } from "../../../app/oz/machine/exceptions";
import {
  valueNumber,
  valueMutableVariable,
} from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  buildMu,
  buildMutableMapping,
  getLastAuxiliaryIdentifier,
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";

describe("Reducing cell creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("raises a failure when the cell is already bound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellCreationStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, failureException()),
    );
  });

  it("blocks the current thread if the value expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellCreationStatement(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("X")),
        ),
        identifierExpression(lexicalIdentifier("Y")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });

  it("blocks the current thread if the cell expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellCreationStatement(
        identifierExpression(lexicalIdentifier("Y")),
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("X")),
        ),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
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
      cellCreationStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(undefined, buildVariable("x", 0)),
          buildEquivalenceClass(
            valueMutableVariable("cell", 0),
            buildVariable("y", 0),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("cell", 0),
            buildVariable("x", 0),
          ),
        ),
      }),
    );
  });

  it("executes correctly when the expression evaluates to a value", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellCreationStatement(
        literalExpression(literalNumber(5)),
        identifierExpression(lexicalIdentifier("Y")),
      ),
      buildEnvironment({
        Y: buildVariable("y", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueMutableVariable("cell", 0),
            buildVariable("y", 0),
          ),
          buildEquivalenceClass(
            valueNumber(5),
            buildVariable(
              getLastAuxiliaryIdentifier("cellValue").get("identifier"),
              0,
            ),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("cell", 0),
            buildVariable(
              getLastAuxiliaryIdentifier("cellValue").get("identifier"),
              0,
            ),
          ),
        ),
      }),
    );
  });
});
