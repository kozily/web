import Immutable from "immutable";
import {
  portSendStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
  literalExpression,
} from "../../app/oz/machine/expressions";
import { literalNumber } from "../../app/oz/machine/literals";
import { buildSystemExceptionState, buildBlockedState } from "./helpers";
import { errorException } from "../../app/oz/machine/exceptions";
import {
  valueNumber,
  valueMutableVariable,
  valueListItem,
} from "../../app/oz/machine/values";
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
import reduce from "../../app/oz/execution/port_send";

describe("Reducing port send statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("blocks the current thread if the port is unbound", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(3)),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });

  it("blocks the current thread if the port expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(3)),
        ),
        literalExpression(literalNumber(3)),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("x", 0)),
    );
  });

  it("blocks the current thread if the value expression blocks", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("port", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("s", 0)),
        buildEquivalenceClass(undefined, buildVariable("v", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("port", 0),
          buildVariable("s", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("V")),
          literalExpression(literalNumber(2)),
        ),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
        V: buildVariable("v", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildBlockedState(state, statement, 0, buildVariable("v", 0)),
    );
  });

  it("raises an error if the port expression an immutable value", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(literalNumber(3), buildVariable("x", 0)),
        buildEquivalenceClass(undefined, buildVariable("s", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(3)),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException(0)),
    );
  });

  it("raises an error if the port expression returns a mutable cell", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("cell", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("s", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("cell", 0),
          buildVariable("s", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(3)),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, errorException(0)),
    );
  });

  it("sends a message through the port if everything is right", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueMutableVariable("port", 0),
          buildVariable("x", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("s", 0)),
      ),
      mu: buildMu(
        buildMutableMapping(
          valueMutableVariable("port", 0),
          buildVariable("s", 0),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(3)),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            valueMutableVariable("port", 0),
            buildVariable("x", 0),
          ),
          buildEquivalenceClass(undefined, buildVariable("s", 1)),
          buildEquivalenceClass(
            valueListItem(valueNumber(3), buildVariable("s", 1)),
            buildVariable("s", 0),
          ),
        ),
        mu: buildMu(
          buildMutableMapping(
            valueMutableVariable("port", 0),
            buildVariable("s", 1),
          ),
        ),
      }),
    );
  });
});
