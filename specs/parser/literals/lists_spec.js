import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";
import { lexicalIdentifier } from "../../samples/lexical";
import { literalList } from "../../samples/literals";

const parse = parserFor(literalGrammar);

const identifiersList = (identifiers = []) =>
  literalList(identifiers.map(id => lexicalIdentifier(id)));

describe("Parsing list literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles lists correctly", () => {
    expect(parse("[]")).toEqual(identifiersList());
    expect(parse("[ ]")).toEqual(identifiersList());
  });

  it("handles lists with one element", () => {
    expect(parse("[X]")).toEqual(identifiersList(["X"]));
    expect(parse("[ X ]")).toEqual(identifiersList(["X"]));
  });

  it("handles lists with more than 1 element correctly", () => {
    const list = identifiersList(["X", "Y", "Z"]);
    expect(parse("[X Y Z]")).toEqual(list);
    expect(parse("[X   Y Z]")).toEqual(list);
    expect(parse("[X Y Z A]")).toEqual(identifiersList(["X", "Y", "Z", "A"]));
  });

  it("handles lists with more than 1 same element correctly", () => {
    expect(parse("[X A Y Z Z A]")).toEqual(
      identifiersList(["X", "A", "Y", "Z", "Z", "A"]),
    );
  });
});
