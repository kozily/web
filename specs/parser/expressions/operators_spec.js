import Immutable from "immutable";
import { literalNumber } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { operatorExpression } from "../../../app/oz/machine/expressions";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses simple sums successfully", () => {
    expect(parse("A + 2")).toEqual(
      operatorExpression("+", lexicalIdentifier("A"), literalNumber(2)),
    );
    expect(parse("A - 2")).toEqual(
      operatorExpression("-", lexicalIdentifier("A"), literalNumber(2)),
    );
  });

  it("parses sequential sums successfully", () => {
    expect(parse("1 + 2 + 3")).toEqual(
      operatorExpression(
        "+",
        operatorExpression("+", literalNumber(1), literalNumber(2)),
        literalNumber(3),
      ),
    );
    expect(parse("1 - 2 - 3")).toEqual(
      operatorExpression(
        "-",
        operatorExpression("-", literalNumber(1), literalNumber(2)),
        literalNumber(3),
      ),
    );
  });

  it("parses products successfully", () => {
    expect(parse("A * 3")).toEqual(
      operatorExpression("*", lexicalIdentifier("A"), literalNumber(3)),
    );
    expect(parse("A / 3")).toEqual(
      operatorExpression("/", lexicalIdentifier("A"), literalNumber(3)),
    );
  });

  it("parses sequential products successfully", () => {
    expect(parse("A * 3 * C")).toEqual(
      operatorExpression(
        "*",
        operatorExpression("*", lexicalIdentifier("A"), literalNumber(3)),
        lexicalIdentifier("C"),
      ),
    );
    expect(parse("A / 3 / C")).toEqual(
      operatorExpression(
        "/",
        operatorExpression("/", lexicalIdentifier("A"), literalNumber(3)),
        lexicalIdentifier("C"),
      ),
    );
  });

  it("parses combined sums and products successfully", () => {
    expect(parse("A * 3 + 2 / 5")).toEqual(
      operatorExpression(
        "+",
        operatorExpression("*", lexicalIdentifier("A"), literalNumber(3)),
        operatorExpression("/", literalNumber(2), literalNumber(5)),
      ),
    );
    expect(parse("A * 3 - 2 / 5")).toEqual(
      operatorExpression(
        "-",
        operatorExpression("*", lexicalIdentifier("A"), literalNumber(3)),
        operatorExpression("/", literalNumber(2), literalNumber(5)),
      ),
    );
  });
});
