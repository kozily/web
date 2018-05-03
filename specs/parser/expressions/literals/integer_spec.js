import Immutable from "immutable";
import { numberExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing integer literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles decimal integers correctly", () => {
    expect(parse("1986")).toEqual(numberExpression(1986));
    expect(parse("~1986")).toEqual(numberExpression(-1986));
  });

  it("handles octal integers correctly", () => {
    expect(parse("011")).toEqual(numberExpression(9));
    expect(parse("~011")).toEqual(numberExpression(-9));
  });

  it("handles hexal integers correctly", () => {
    expect(parse("0x11")).toEqual(numberExpression(17));
    expect(parse("0X11")).toEqual(numberExpression(17));
    expect(parse("~0x11")).toEqual(numberExpression(-17));
    expect(parse("~0X11")).toEqual(numberExpression(-17));
  });

  it("handles binary integers correctly", () => {
    expect(parse("0b11")).toEqual(numberExpression(3));
    expect(parse("0B11")).toEqual(numberExpression(3));
    expect(parse("~0b11")).toEqual(numberExpression(-3));
    expect(parse("~0B11")).toEqual(numberExpression(-3));
  });
});
