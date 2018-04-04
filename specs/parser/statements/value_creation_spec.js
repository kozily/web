import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalNumber,
  literalRecord,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import {
  valueCreationStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing numbers", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=5")).toEqual(
        valueCreationStatement(lexicalIdentifier("X"), literalNumber(5)),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("Variable = 12.0")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("Variable"),
          literalNumber(12.0),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = 152")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("One Variable"),
          literalNumber(152),
        ),
      );
    });
  });

  describe("when parsing records", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("One Variable"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });
  });

  describe("when parsing procedures", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=proc{$ X Y} skip end")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatement(),
          ),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = proc{$ X Y} skip end")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatement(),
          ),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = proc{$ X Y} skip end")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("One Variable"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatement(),
          ),
        ),
      );
    });
  });
});
