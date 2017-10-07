import Immutable from "immutable";
import lexical from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical record elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(a:X b:Y)")).toEqual(
      lexical.record("label", {
        a: lexical.variable("X"),
        b: lexical.variable("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(a:X)")).toEqual(
      lexical.record("label", {
        a: lexical.variable("X"),
      }),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  a:X\n  b:Y\n)")).toEqual(
      lexical.record("label", {
        a: lexical.variable("X"),
        b: lexical.variable("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  a:X\n  \n)")).toEqual(
      lexical.record("label", {
        a: lexical.variable("X"),
      }),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(a:X b:Y)")).toEqual(
      lexical.record("andthen", {
        a: lexical.variable("X"),
        b: lexical.variable("Y"),
      }),
    );
  });
});
