import Immutable from "immutable";
import { literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  operatorExpression,
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing parenthesis expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses a root parenthesis expression successfully", () => {
    expect(parse("( A + B )")).toEqual(
      operatorExpression(
        "+",
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
      ),
    );
  });

  it("parses a simple parenthesis expression successfully", () => {
    expect(parse("( A + B ) * C")).toEqual(
      operatorExpression(
        "*",
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        identifierExpression(lexicalIdentifier("C")),
      ),
    );
  });

  it("parses nested parenthesis expressions successfully", () => {
    expect(parse("(A + (B + C)) * 2")).toEqual(
      operatorExpression(
        "*",
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("A")),
          operatorExpression(
            "+",
            identifierExpression(lexicalIdentifier("B")),
            identifierExpression(lexicalIdentifier("C")),
          ),
        ),
        literalExpression(literalNumber(2)),
      ),
    );
  });
});
