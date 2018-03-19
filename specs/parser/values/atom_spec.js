import Immutable from "immutable";
import { valueAtom } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing atom values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted atoms correctly", () => {
    expect(parse("a")).toEqual(valueAtom("a"));
    expect(parse("foo")).toEqual(valueAtom("foo"));
    expect(parse("a_person")).toEqual(valueAtom("a_person"));
    expect(parse("donkeyKong3")).toEqual(valueAtom("donkeyKong3"));
  });

  it("handles quoted atoms correctly", () => {
    expect(parse("'='")).toEqual(valueAtom("="));
    expect(parse("':='")).toEqual(valueAtom(":="));
    expect(parse("'Oz 3.0'")).toEqual(valueAtom("Oz 3.0"));
    expect(parse("'Hello World'")).toEqual(valueAtom("Hello World"));
    expect(parse("'if'")).toEqual(valueAtom("if"));
    expect(parse("'\n,\n '")).toEqual(valueAtom("\n,\n "));
    expect(parse("'#### hello ####'")).toEqual(valueAtom("#### hello ####"));
    expect(parse("'true'")).toEqual(valueAtom("true"));
    expect(parse("'false'")).toEqual(valueAtom("false"));
  });

  it("handles special keywords not atoms", () => {
    expect(parse("unit")).not.toEqual(valueAtom("unit"));
    expect(parse("andthen")).not.toEqual(valueAtom("andthen"));
  });
});
