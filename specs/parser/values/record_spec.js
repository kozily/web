import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { valueRecord } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing record values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(a:X b:Y)")).toEqual(
      valueRecord("label", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(a:X)")).toEqual(
      valueRecord("label", {
        a: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(feature:X)")).toEqual(
      valueRecord("label", {
        feature: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  a:X\n  b:Y\n)")).toEqual(
      valueRecord("label", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  a:X\n  \n)")).toEqual(
      valueRecord("label", {
        a: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(a:X b:Y)")).toEqual(
      valueRecord("andthen", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });
});
