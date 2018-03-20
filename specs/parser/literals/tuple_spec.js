import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { literalTuple } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(valueGrammar);

describe("Parsing tuple values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(X Y)")).toEqual(
      literalTuple("label", [lexicalIdentifier("X"), lexicalIdentifier("Y")]),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(X)")).toEqual(
      literalTuple("label", [lexicalIdentifier("X")]),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(Feature)")).toEqual(
      literalTuple("label", [lexicalIdentifier("Feature")]),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  X\n  Y\n)")).toEqual(
      literalTuple("label", [lexicalIdentifier("X"), lexicalIdentifier("Y")]),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  X\n  \n)")).toEqual(
      literalTuple("label", [lexicalIdentifier("X")]),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(X Y)")).toEqual(
      literalTuple("andthen", [lexicalIdentifier("X"), lexicalIdentifier("Y")]),
    );
  });
});
