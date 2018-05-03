import Immutable from "immutable";
import { evaluate } from "../../../app/oz/evaluation";
import {
  buildEnvironment,
  buildVariable,
  buildSigma,
  buildEquivalenceClass,
} from "../../../app/oz/machine/build";
import { literalRecord, literalNumber } from "../../../app/oz/machine/literals";
import { valueRecord, valueNumber } from "../../../app/oz/machine/values";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  literalExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";

describe("Evaluating literal records", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a sigma record value", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
    );
    const literal = literalRecord("person", {
      age: identifierExpression(lexicalIdentifier("X")),
      name: identifierExpression(lexicalIdentifier("Y")),
    });
    const result = evaluate(literal, environment, sigma);

    expect(result.get("value")).toEqual(
      valueRecord("person", {
        age: buildVariable("x", 0),
        name: buildVariable("y", 0),
      }),
    );
  });

  it("creates a nested record value", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("x", 0)),
      buildEquivalenceClass(valueNumber(10), buildVariable("y", 0)),
    );
    const literal = literalRecord("person", {
      age: literalExpression(literalNumber(30)),
      name: identifierExpression(lexicalIdentifier("Y")),
    });
    const result = evaluate(literal, environment, sigma);

    expect(result.get("value")).toEqual(
      valueRecord("person", {
        age: valueNumber(30),
        name: buildVariable("y", 0),
      }),
    );
  });

  it("evaluates nested inline expressions and creates a record value", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(valueNumber(10), buildVariable("x", 0)),
      buildEquivalenceClass(undefined, buildVariable("y", 0)),
    );
    const literal = literalRecord("person", {
      age: operatorExpression(
        "+",
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(2)),
      ),
      name: identifierExpression(lexicalIdentifier("Y")),
    });
    const result = evaluate(literal, environment, sigma);

    expect(result.get("value")).toEqual(
      valueRecord("person", {
        age: valueNumber(12),
        name: buildVariable("y", 0),
      }),
    );
  });

  it("blocks if a nested inline expression blocks", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const sigma = buildSigma(
      buildEquivalenceClass(undefined, buildVariable("x", 0)),
      buildEquivalenceClass(undefined, buildVariable("y", 0)),
    );
    const literal = literalRecord("person", {
      age: operatorExpression(
        "+",
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(2)),
      ),
      name: identifierExpression(lexicalIdentifier("Y")),
    });
    const result = evaluate(literal, environment, sigma);

    expect(result.get("value")).toEqual(undefined);
    expect(result.get("waitCondition")).toEqual(buildVariable("x", 0));
  });
});
