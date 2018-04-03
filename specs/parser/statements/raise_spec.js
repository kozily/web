import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { raiseStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing try statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("raise X end")).toEqual(
      raiseStatement(lexicalIdentifier("X")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("raise\n\t     X\n\nend")).toEqual(
      raiseStatement(lexicalIdentifier("X")),
    );
  });
});
