import Immutable from "immutable";
import { lexicalAtom } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical atom elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted atoms correctly", () => {
    expect(parse("a")).toEqual(lexicalAtom("a"));
    expect(parse("foo")).toEqual(lexicalAtom("foo"));
    expect(parse("a_person")).toEqual(lexicalAtom("a_person"));
    expect(parse("donkeyKong3")).toEqual(lexicalAtom("donkeyKong3"));
  });

  it("handles quoted atoms correctly", () => {
    expect(parse("'='")).toEqual(lexicalAtom("="));
    expect(parse("':='")).toEqual(lexicalAtom(":="));
    expect(parse("'Oz 3.0'")).toEqual(lexicalAtom("Oz 3.0"));
    expect(parse("'Hello World'")).toEqual(lexicalAtom("Hello World"));
    expect(parse("'if'")).toEqual(lexicalAtom("if"));
    expect(parse("'\n,\n '")).toEqual(lexicalAtom("\n,\n "));
    expect(parse("'#### hello ####'")).toEqual(lexicalAtom("#### hello ####"));
    expect(parse("'true'")).toEqual(lexicalAtom("true"));
    expect(parse("'false'")).toEqual(lexicalAtom("false"));
  });

  it("handles special keywords not atoms", () => {
    expect(parse("unit")).not.toEqual(lexicalAtom("unit"));
    expect(parse("andthen")).not.toEqual(lexicalAtom("andthen"));
  });
});
