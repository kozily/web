import Immutable from "immutable";
import { numberExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing char literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles numeric characters correctly", () => {
    expect(parse("0")).toEqual(numberExpression(0));
    expect(parse("40")).toEqual(numberExpression(40));
    expect(parse("255")).toEqual(numberExpression(255));
  });

  it("handles explicit characters correctly", () => {
    expect(parse("&a")).toEqual(numberExpression("a".charCodeAt(0)));
    expect(parse("& ")).toEqual(numberExpression(" ".charCodeAt(0)));
  });

  it("handles octal characters correctly", () => {
    expect(parse("&\\101")).toEqual(numberExpression(65));
  });

  it("handles hexal characters correctly", () => {
    expect(parse("&\\xff")).toEqual(numberExpression(255));
    expect(parse("&\\X0A")).toEqual(numberExpression(10));
    expect(parse("&\\XfA")).toEqual(numberExpression(250));
  });

  it("handles escaped character correctly", () => {
    expect(parse("&\\a")).toEqual(numberExpression(7));
    expect(parse("&\\b")).toEqual(numberExpression(8));
    expect(parse("&\\f")).toEqual(numberExpression(12));
    expect(parse("&\\n")).toEqual(numberExpression(10));
    expect(parse("&\\r")).toEqual(numberExpression(13));
    expect(parse("&\\t")).toEqual(numberExpression(9));
    expect(parse("&\\v")).toEqual(numberExpression(11));
    expect(parse("&\\\\")).toEqual(numberExpression(92));
    expect(parse("&\\'")).toEqual(numberExpression(39));
    expect(parse('&\\"')).toEqual(numberExpression(34));
    expect(parse("&\\`")).toEqual(numberExpression(96));
    expect(parse("&\\&")).toEqual(numberExpression(38));
  });
});
