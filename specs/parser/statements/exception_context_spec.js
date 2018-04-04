import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import {
  exceptionContextStatement,
  skipStatement,
  sequenceStatement,
} from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing try statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("try skip catch X then skip skip end")).toEqual(
      exceptionContextStatement(
        skipStatement(),
        lexicalIdentifier("X"),
        sequenceStatement(skipStatement(), skipStatement()),
      ),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("try\n\tskip\ncatch X then\n\tskip\n\tskip\nend")).toEqual(
      exceptionContextStatement(
        skipStatement(),
        lexicalIdentifier("X"),
        sequenceStatement(skipStatement(), skipStatement()),
      ),
    );
  });
});
