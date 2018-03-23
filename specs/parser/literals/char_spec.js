import Immutable from "immutable";
import { literalNumber } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing char literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles numeric characters correctly", () => {
    expect(parse("40")).toEqual(literalNumber(40));
    expect(parse("255")).toEqual(literalNumber(255));
  });

  it("handles explicit characters correctly", () => {
    expect(parse("&a")).toEqual(literalNumber("a".charCodeAt(0)));
    expect(parse("& ")).toEqual(literalNumber(" ".charCodeAt(0)));
  });

  it("handles octal characters correctly", () => {
    expect(parse("&\\101")).toEqual(literalNumber(65));
  });

  it("handles hexal characters correctly", () => {
    expect(parse("&\\xff")).toEqual(literalNumber(255));
    expect(parse("&\\X0A")).toEqual(literalNumber(10));
    expect(parse("&\\XfA")).toEqual(literalNumber(250));
  });

  it("handles escaped character correctly", () => {
    expect(parse("&\\a")).toEqual(literalNumber(7));
    expect(parse("&\\b")).toEqual(literalNumber(8));
    expect(parse("&\\f")).toEqual(literalNumber(12));
    expect(parse("&\\n")).toEqual(literalNumber(10));
    expect(parse("&\\r")).toEqual(literalNumber(13));
    expect(parse("&\\t")).toEqual(literalNumber(9));
    expect(parse("&\\v")).toEqual(literalNumber(11));
    expect(parse("&\\\\")).toEqual(literalNumber(92));
    expect(parse("&\\'")).toEqual(literalNumber(39));
    expect(parse('&\\"')).toEqual(literalNumber(34));
    expect(parse("&\\`")).toEqual(literalNumber(96));
    expect(parse("&\\&")).toEqual(literalNumber(38));
  });
});
