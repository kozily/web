import Immutable from "immutable";
import { lexicalRecord, lexicalVariable } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical record elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(a:X b:Y)")).toEqual(
      lexicalRecord("label", {
        a: lexicalVariable("X"),
        b: lexicalVariable("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(a:X)")).toEqual(
      lexicalRecord("label", {
        a: lexicalVariable("X"),
      }),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(feature:X)")).toEqual(
      lexicalRecord("label", {
        feature: lexicalVariable("X"),
      }),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  a:X\n  b:Y\n)")).toEqual(
      lexicalRecord("label", {
        a: lexicalVariable("X"),
        b: lexicalVariable("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  a:X\n  \n)")).toEqual(
      lexicalRecord("label", {
        a: lexicalVariable("X"),
      }),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(a:X b:Y)")).toEqual(
      lexicalRecord("andthen", {
        a: lexicalVariable("X"),
        b: lexicalVariable("Y"),
      }),
    );
  });
});
