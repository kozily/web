import Immutable from "immutable";
import { lexicalVariable, lexicalTuple } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical tuple elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(X Y)")).toEqual(
      lexicalTuple("label", [lexicalVariable("X"), lexicalVariable("Y")]),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(X)")).toEqual(
      lexicalTuple("label", [lexicalVariable("X")]),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(Feature)")).toEqual(
      lexicalTuple("label", [lexicalVariable("Feature")]),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  X\n  Y\n)")).toEqual(
      lexicalTuple("label", [lexicalVariable("X"), lexicalVariable("Y")]),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  X\n  \n)")).toEqual(
      lexicalTuple("label", [lexicalVariable("X")]),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(X Y)")).toEqual(
      lexicalTuple("andthen", [lexicalVariable("X"), lexicalVariable("Y")]),
    );
  });
});
