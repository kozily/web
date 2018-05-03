import Immutable from "immutable";
import { evaluate } from "../../../app/oz/evaluation";
import { buildEnvironment, buildVariable } from "../../../app/oz/machine/build";
import {
  literalNumber,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import { valueProcedure } from "../../../app/oz/machine/values";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import {
  skipStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";

describe("Evaluating literal procedures", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a sigma procedure value without arguments or free identifiers", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const literal = literalProcedure([], skipStatement());
    const result = evaluate(literal, environment);

    expect(result.get("value")).toEqual(
      valueProcedure([], skipStatement(), {}),
    );
  });

  it("creates a sigma procedure value with arguments", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const literal = literalProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      skipStatement(),
    );
    const result = evaluate(literal, environment);

    expect(result.get("value")).toEqual(
      valueProcedure(
        [lexicalIdentifier("A"), lexicalIdentifier("B")],
        skipStatement(),
        {},
      ),
    );
  });

  it("creates a sigma procedure value with free identifiers", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });
    const literal = literalProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(5)),
      ),
    );
    const result = evaluate(literal, environment);

    expect(result.get("value")).toEqual(
      valueProcedure(
        [lexicalIdentifier("A"), lexicalIdentifier("B")],
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(5)),
        ),
        { X: buildVariable("x", 0) },
      ),
    );
  });
});
