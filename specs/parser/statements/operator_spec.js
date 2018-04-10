import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalAtom } from "../../../app/oz/machine/literals";
import { operatorStatement } from "../../../app/oz/machine/statements";
import parse from "../../../app/oz/parser";

describe("Parsing Z=X.F statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing identifiers", () => {
    it("handles identifier correctly", () => {
      expect(parse("Z=X.F")).toEqual(
        operatorStatement(
          lexicalIdentifier("Z"),
          lexicalIdentifier("X"),
          lexicalIdentifier("F"),
        ),
      );
    });

    it("handles atom correctly", () => {
      expect(parse("Z=X.age")).toEqual(
        operatorStatement(
          lexicalIdentifier("Z"),
          lexicalIdentifier("X"),
          literalAtom("age"),
        ),
      );
    });
  });
});
