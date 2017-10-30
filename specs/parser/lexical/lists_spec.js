import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";
import { lexicalComplexList, lexicalNil } from "../../samples/lexical";

const parse = parserFor(lexicalGrammar);

describe("Parsing lists", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles lists correctly", () => {
    expect(parse("[]")).toEqual(lexicalNil());
    expect(parse("[ ]")).toEqual(lexicalNil());
  });

  it("handles lists with one element", () => {
    expect(parse("[X]")).toEqual(lexicalComplexList(["X"]));
    expect(parse("[ X ]")).toEqual(lexicalComplexList(["X"]));
  });

  it("handles lists with more than 1 element correctly", () => {
    const aux = lexicalComplexList(["X", "Y", "Z"]);
    expect(parse("[X Y Z]")).toEqual(aux);
    expect(parse("[X   Y Z]")).toEqual(aux);
    expect(parse("[X Y Z A]")).toEqual(
      lexicalComplexList(["X", "Y", "Z", "A"]),
    );
  });

  it("handles lists with more than 1 same element correctly", () => {
    expect(parse("[X A Y Z Z A]")).toEqual(
      lexicalComplexList(["X", "A", "Y", "Z", "Z", "A"]),
    );
  });
});
