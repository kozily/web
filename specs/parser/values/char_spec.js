import Immutable from "immutable";
import { valueNumber } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing char values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles numeric characters correclty", () => {
    expect(parse("40")).toEqual(valueNumber(40));
    expect(parse("255")).toEqual(valueNumber(255));
  });

  it("handles explicit characters correctly", () => {
    expect(parse("&a")).toEqual(valueNumber("a".charCodeAt(0)));
    expect(parse("& ")).toEqual(valueNumber(" ".charCodeAt(0)));
  });

  it("handles octal characters correctly", () => {
    expect(parse("&\\101")).toEqual(valueNumber(65));
  });

  it("handles hexal characters correctly", () => {
    expect(parse("&\\xff")).toEqual(valueNumber(255));
    expect(parse("&\\X0A")).toEqual(valueNumber(10));
    expect(parse("&\\XfA")).toEqual(valueNumber(250));
  });

  it("handles escaped character correctly", () => {
    expect(parse("&\\a")).toEqual(valueNumber(7));
    expect(parse("&\\b")).toEqual(valueNumber(8));
    expect(parse("&\\f")).toEqual(valueNumber(12));
    expect(parse("&\\n")).toEqual(valueNumber(10));
    expect(parse("&\\r")).toEqual(valueNumber(13));
    expect(parse("&\\t")).toEqual(valueNumber(9));
    expect(parse("&\\v")).toEqual(valueNumber(11));
    expect(parse("&\\\\")).toEqual(valueNumber(92));
    expect(parse("&\\'")).toEqual(valueNumber(39));
    expect(parse('&\\"')).toEqual(valueNumber(34));
    expect(parse("&\\`")).toEqual(valueNumber(96));
    expect(parse("&\\&")).toEqual(valueNumber(38));
  });
});
