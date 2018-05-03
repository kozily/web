import Immutable from "immutable";
import { atomExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing atom literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted atoms correctly", () => {
    expect(parse("a")).toEqual(atomExpression("a"));
    expect(parse("foo")).toEqual(atomExpression("foo"));
    expect(parse("a_person")).toEqual(atomExpression("a_person"));
    expect(parse("donkeyKong3")).toEqual(atomExpression("donkeyKong3"));
  });

  it("handles quoted atoms correctly", () => {
    expect(parse("'='")).toEqual(atomExpression("="));
    expect(parse("':='")).toEqual(atomExpression(":="));
    expect(parse("'Oz 3.0'")).toEqual(atomExpression("Oz 3.0"));
    expect(parse("'Hello World'")).toEqual(atomExpression("Hello World"));
    expect(parse("'if'")).toEqual(atomExpression("if"));
    expect(parse("'\n,\n '")).toEqual(atomExpression("\n,\n "));
    expect(parse("'true'")).toEqual(atomExpression("true"));
    expect(parse("'false'")).toEqual(atomExpression("false"));
    expect(parse("'#### hello ####'")).toEqual(
      atomExpression("#### hello ####"),
    );
  });

  it("handles special keywords not atoms", () => {
    expect(parse("unit")).not.toEqual(atomExpression("unit"));
    expect(parse("andthen")).not.toEqual(atomExpression("andthen"));
  });
});
