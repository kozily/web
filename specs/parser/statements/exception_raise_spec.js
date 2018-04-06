import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { exceptionRaiseStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("raise X end")).toEqual(
      exceptionRaiseStatement(lexicalIdentifier("X")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("raise\n\t     X\n\nend")).toEqual(
      exceptionRaiseStatement(lexicalIdentifier("X")),
    );
  });
});
