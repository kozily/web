import Immutable from "immutable";
import { literalNumber } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(valueGrammar);

describe("Parsing integer values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles decimal integers correctly", () => {
    expect(parse("1986")).toEqual(literalNumber(1986));
    expect(parse("~1986")).toEqual(literalNumber(-1986));
  });

  it("handles octal integers correctly", () => {
    expect(parse("011")).toEqual(literalNumber(9));
    expect(parse("~011")).toEqual(literalNumber(-9));
  });

  it("handles hexal integers correctly", () => {
    expect(parse("0x11")).toEqual(literalNumber(17));
    expect(parse("0X11")).toEqual(literalNumber(17));
    expect(parse("~0x11")).toEqual(literalNumber(-17));
    expect(parse("~0X11")).toEqual(literalNumber(-17));
  });

  it("handles binary integers correctly", () => {
    expect(parse("0b11")).toEqual(literalNumber(3));
    expect(parse("0B11")).toEqual(literalNumber(3));
    expect(parse("~0b11")).toEqual(literalNumber(-3));
    expect(parse("~0B11")).toEqual(literalNumber(-3));
  });
});
