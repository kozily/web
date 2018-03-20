import Immutable from "immutable";
import { literalAtom } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing atom literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted atoms correctly", () => {
    expect(parse("a")).toEqual(literalAtom("a"));
    expect(parse("foo")).toEqual(literalAtom("foo"));
    expect(parse("a_person")).toEqual(literalAtom("a_person"));
    expect(parse("donkeyKong3")).toEqual(literalAtom("donkeyKong3"));
  });

  it("handles quoted atoms correctly", () => {
    expect(parse("'='")).toEqual(literalAtom("="));
    expect(parse("':='")).toEqual(literalAtom(":="));
    expect(parse("'Oz 3.0'")).toEqual(literalAtom("Oz 3.0"));
    expect(parse("'Hello World'")).toEqual(literalAtom("Hello World"));
    expect(parse("'if'")).toEqual(literalAtom("if"));
    expect(parse("'\n,\n '")).toEqual(literalAtom("\n,\n "));
    expect(parse("'#### hello ####'")).toEqual(literalAtom("#### hello ####"));
    expect(parse("'true'")).toEqual(literalAtom("true"));
    expect(parse("'false'")).toEqual(literalAtom("false"));
  });

  it("handles special keywords not atoms", () => {
    expect(parse("unit")).not.toEqual(literalAtom("unit"));
    expect(parse("andthen")).not.toEqual(literalAtom("andthen"));
  });
});
