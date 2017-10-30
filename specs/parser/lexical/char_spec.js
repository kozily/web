import Immutable from "immutable";
import { lexicalNumber } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical char elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles numeric characters correclty", () => {
    expect(parse("40")).toEqual(lexicalNumber(40));
    expect(parse("255")).toEqual(lexicalNumber(255));
  });

  it("handles explicit characters correctly", () => {
    expect(parse("&a")).toEqual(lexicalNumber("a".charCodeAt(0)));
    expect(parse("& ")).toEqual(lexicalNumber(" ".charCodeAt(0)));
  });

  it("handles octal characters correctly", () => {
    expect(parse("&\\101")).toEqual(lexicalNumber(65));
  });

  it("handles hexal characters correctly", () => {
    expect(parse("&\\xff")).toEqual(lexicalNumber(255));
    expect(parse("&\\X0A")).toEqual(lexicalNumber(10));
    expect(parse("&\\XfA")).toEqual(lexicalNumber(250));
  });

  it("handles escaped character correctly", () => {
    expect(parse("&\\a")).toEqual(lexicalNumber(7));
    expect(parse("&\\b")).toEqual(lexicalNumber(8));
    expect(parse("&\\f")).toEqual(lexicalNumber(12));
    expect(parse("&\\n")).toEqual(lexicalNumber(10));
    expect(parse("&\\r")).toEqual(lexicalNumber(13));
    expect(parse("&\\t")).toEqual(lexicalNumber(9));
    expect(parse("&\\v")).toEqual(lexicalNumber(11));
    expect(parse("&\\\\")).toEqual(lexicalNumber(92));
    expect(parse("&\\'")).toEqual(lexicalNumber(39));
    expect(parse('&\\"')).toEqual(lexicalNumber(34));
    expect(parse("&\\`")).toEqual(lexicalNumber(96));
    expect(parse("&\\&")).toEqual(lexicalNumber(38));
  });
});
