import Immutable from "immutable";
import { valueNumber } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing integer values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles decimal integers correctly", () => {
    expect(parse("1986")).toEqual(valueNumber(1986));
    expect(parse("~1986")).toEqual(valueNumber(-1986));
  });

  it("handles octal integers correctly", () => {
    expect(parse("011")).toEqual(valueNumber(9));
    expect(parse("~011")).toEqual(valueNumber(-9));
  });

  it("handles hexal integers correctly", () => {
    expect(parse("0x11")).toEqual(valueNumber(17));
    expect(parse("0X11")).toEqual(valueNumber(17));
    expect(parse("~0x11")).toEqual(valueNumber(-17));
    expect(parse("~0X11")).toEqual(valueNumber(-17));
  });

  it("handles binary integers correctly", () => {
    expect(parse("0b11")).toEqual(valueNumber(3));
    expect(parse("0B11")).toEqual(valueNumber(3));
    expect(parse("~0b11")).toEqual(valueNumber(-3));
    expect(parse("~0B11")).toEqual(valueNumber(-3));
  });
});