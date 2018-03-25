import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/store";
import { buildEnvironment, buildVariable } from "../../app/oz/machine/build";
import { literalNumber, literalProcedure } from "../samples/literals";
import { valueProcedure } from "../samples/values";
import { lexicalIdentifier } from "../samples/lexical";
import { skipStatement, valueCreationStatement } from "../samples/statements";

describe("Creating procedure values in the store", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a store procedure value without arguments or free identifiers", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });

    const literal = literalProcedure([], skipStatement());

    expect(createValue(environment, literal)).toEqual(
      valueProcedure([], skipStatement(), {}),
    );
  });

  it("creates a store procedure value with arguments", () => {
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

  it("creates a store procedure value with free identifiers", () => {
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
