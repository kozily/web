import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { literalRecord } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing record literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(a:X b:Y)")).toEqual(
      literalRecord("label", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(a:X)")).toEqual(
      literalRecord("label", {
        a: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(feature:X)")).toEqual(
      literalRecord("label", {
        feature: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  a:X\n  b:Y\n)")).toEqual(
      literalRecord("label", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  a:X\n  \n)")).toEqual(
      literalRecord("label", {
        a: lexicalIdentifier("X"),
      }),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(a:X b:Y)")).toEqual(
      literalRecord("andthen", {
        a: lexicalIdentifier("X"),
        b: lexicalIdentifier("Y"),
      }),
    );
  });
});
