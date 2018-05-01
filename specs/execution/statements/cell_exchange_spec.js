import Immutable from "immutable";
import {
  cellExchangeStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
import {
  errorException,
  failureException,
} from "../../../app/oz/machine/exceptions";
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
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";

describe("Reducing cell exchange statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("blocks when the cell expression is undefined", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });

  it("blocks when the cell expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("X")),
        ),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });

  it("blocks when the next value expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("cell", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("Z")),
          identifierExpression(lexicalIdentifier("Z")),
        ),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("z", 0)),
    );
  });

  it("raises an error when the cell expression returns a port", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("port", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException()),
    );
  });

  it("raises an error when the cell expression does not return a mutable value", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(valueNumber(30), buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException()),
    );
  });

  it("raises a failure when the current value can't be bound to the current cell value", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("cell", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(valueNumber(3), buildVariable("y", 0)),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("v", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("cell", 0),
          buildVariable("v", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, failureException()),
    );
  });

  it("executes correctly when everything is right", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("cell", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(valueNumber(10), buildVariable("z", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("v", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("cell", 0),
          buildVariable("v", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      }),
    );

    expect(execute(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueMutableVariable("cell", 0),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(valueNumber(10), buildVariable("z", 0)),
          buildEquivalenceClass(
            valueNumber(5),
            buildVariable("v", 0),
            buildVariable("y", 0),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("cell", 0),
            buildVariable("z", 0),
          ),
        ),
      }),
    );
  });

  it("executes correctly when the current variable and the next variable are the same", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("cell", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("y", 0)),
        buildEquivalenceClass(valueNumber(5), buildVariable("v", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("cell", 0),
          buildVariable("v", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      cellExchangeStatement(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
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
          buildEquivalenceClass(
            valueMutableVariable("cell", 0),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(
            valueNumber(5),
            buildVariable("v", 0),
            buildVariable("y", 0),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("cell", 0),
            buildVariable("y", 0),
          ),
        ),
      }),
    );
  });
});
