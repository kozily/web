import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/sigma";
import { buildEnvironment, buildVariable } from "../../app/oz/machine/build";
import { literalNumber, literalProcedure } from "../../app/oz/machine/literals";
import { valueProcedure } from "../../app/oz/machine/values";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  skipStatement,
  valueCreationStatement,
} from "../../app/oz/machine/statements";

describe("Creating procedure values in the sigma", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a sigma procedure value without arguments or free identifiers", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });

    const literal = literalProcedure([], skipStatement());

    expect(createValue(environment, literal)).toEqual(
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

    expect(createValue(environment, literal)).toEqual(
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
      valueCreationStatement(lexicalIdentifier("X"), literalNumber(5)),
    );

    expect(createValue(environment, literal)).toEqual(
      valueProcedure(
        [lexicalIdentifier("A"), lexicalIdentifier("B")],
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(5)),
        { X: buildVariable("x", 0) },
      ),
    );
  });
});
