import Immutable from "immutable";
import { literalAtom, literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  operatorExpression,
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing record feature selection expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses successfully when rhs is an atom", () => {
    expect(parse("X.age")).toEqual(
      operatorExpression(
        ".",
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalAtom("age")),
      ),
    );
  });

  it("parses successfully when rhs is a number", () => {
    expect(parse("X.1")).toEqual(
      operatorExpression(
        ".",
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(1)),
      ),
    );
  });

  it("parses successfully when rhs is an identifier", () => {
    expect(parse("X.F")).toEqual(
      operatorExpression(
        ".",
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("F")),
      ),
    );
  });

  it("parses sequences of atoms successfully", () => {
    expect(parse("X.age.number")).toEqual(
      operatorExpression(
        ".",
        operatorExpression(
          ".",
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalAtom("age")),
        ),
        literalExpression(literalAtom("number")),
      ),
    );
  });

  it("parses sequences of identifiers successfully", () => {
    expect(parse("X.Y.Z")).toEqual(
      operatorExpression(
        ".",
        operatorExpression(
          ".",
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
        identifierExpression(lexicalIdentifier("Z")),
      ),
    );
  });

  it("parses sequences of integers successfully", () => {
    expect(parse("X.1.2")).toEqual(
      operatorExpression(
        ".",
        operatorExpression(
          ".",
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(1)),
        ),
        literalExpression(literalNumber(2)),
      ),
    );
  });
});
