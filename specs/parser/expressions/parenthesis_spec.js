import Immutable from "immutable";
import { literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { operatorExpression } from "../../../app/oz/machine/expressions";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing identifiers expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses a root parenthesis expression successfully", () => {
    expect(parse("( A + B )")).toEqual(
      operatorExpression("+", lexicalIdentifier("A"), lexicalIdentifier("B")),
    );
  });

  it("parses a simple parenthesis expression successfully", () => {
    expect(parse("( A + B ) * C")).toEqual(
      operatorExpression(
        "*",
        operatorExpression("+", lexicalIdentifier("A"), lexicalIdentifier("B")),
        lexicalIdentifier("C"),
      ),
    );
  });

  it("parses nested parenthesis expressions successfully", () => {
    expect(parse("(A + (B + C)) * 2")).toEqual(
      operatorExpression(
        "*",
        operatorExpression(
          "+",
          lexicalIdentifier("A"),
          operatorExpression(
            "+",
            lexicalIdentifier("B"),
            lexicalIdentifier("C"),
          ),
        ),
        literalNumber(2),
      ),
    );
  });
});
