import Immutable from "immutable";
import { lexicalNumber } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical integer elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles decimal integers correctly", () => {
    expect(parse("1986")).toEqual(lexicalNumber(1986));
    expect(parse("~1986")).toEqual(lexicalNumber(-1986));
  });

  it("handles octal integers correctly", () => {
    expect(parse("011")).toEqual(lexicalNumber(9));
    expect(parse("~011")).toEqual(lexicalNumber(-9));
  });

  it("handles hexal integers correctly", () => {
    expect(parse("0x11")).toEqual(lexicalNumber(17));
    expect(parse("0X11")).toEqual(lexicalNumber(17));
    expect(parse("~0x11")).toEqual(lexicalNumber(-17));
    expect(parse("~0X11")).toEqual(lexicalNumber(-17));
  });

  it("handles binary integers correctly", () => {
    expect(parse("0b11")).toEqual(lexicalNumber(3));
    expect(parse("0B11")).toEqual(lexicalNumber(3));
    expect(parse("~0b11")).toEqual(lexicalNumber(-3));
    expect(parse("~0B11")).toEqual(lexicalNumber(-3));
  });
});
