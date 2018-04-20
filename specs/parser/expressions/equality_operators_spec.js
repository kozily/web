import Immutable from "immutable";
import { literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  operatorExpression,
  literalExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing equality operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses simple comparisons successfully", () => {
    expect(parse("A == 2")).toEqual(
      operatorExpression(
        "==",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
    expect(parse("A \\= 2")).toEqual(
      operatorExpression(
        "\\=",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
    expect(parse("A < 2")).toEqual(
      operatorExpression(
        "<",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
    expect(parse("A <= 2")).toEqual(
      operatorExpression(
        "<=",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
    expect(parse("A > 2")).toEqual(
      operatorExpression(
        ">",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
    expect(parse("A >= 2")).toEqual(
      operatorExpression(
        ">=",
        identifierExpression(lexicalIdentifier("A")),
        literalExpression(literalNumber(2)),
      ),
    );
  });
});
