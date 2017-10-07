import Immutable from "immutable";
import lexical from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical char elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles numeric characters correclty", () => {
    expect(parse("40")).toEqual(lexical.number(40));
    expect(parse("255")).toEqual(lexical.number(255));
  });

  it("handles explicit characters correctly", () => {
    expect(parse("&a")).toEqual(lexical.number("a".charCodeAt(0)));
    expect(parse("& ")).toEqual(lexical.number(" ".charCodeAt(0)));
  });

  it("handles octal characters correctly", () => {
    expect(parse("&\\101")).toEqual(lexical.number(65));
  });

  it("handles hexal characters correctly", () => {
    expect(parse("&\\xff")).toEqual(lexical.number(255));
    expect(parse("&\\X0A")).toEqual(lexical.number(10));
    expect(parse("&\\XfA")).toEqual(lexical.number(250));
  });

  it("handles escaped character correctly", () => {
    expect(parse("&\\a")).toEqual(lexical.number(7));
    expect(parse("&\\b")).toEqual(lexical.number(8));
    expect(parse("&\\f")).toEqual(lexical.number(12));
    expect(parse("&\\n")).toEqual(lexical.number(10));
    expect(parse("&\\r")).toEqual(lexical.number(13));
    expect(parse("&\\t")).toEqual(lexical.number(9));
    expect(parse("&\\v")).toEqual(lexical.number(11));
    expect(parse("&\\\\")).toEqual(lexical.number(92));
    expect(parse("&\\'")).toEqual(lexical.number(39));
    expect(parse('&\\"')).toEqual(lexical.number(34));
    expect(parse("&\\`")).toEqual(lexical.number(96));
    expect(parse("&\\&")).toEqual(lexical.number(38));
  });
});
