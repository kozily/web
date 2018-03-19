import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { valueNumber, valueRecord } from "../../samples/values";
import { valueCreationStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing numbers", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=5")).toEqual(
        valueCreationStatement(lexicalIdentifier("X"), valueNumber(5)),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("Variable = 12.0")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("Variable"),
          valueNumber(12.0),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = 152")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("One Variable"),
          valueNumber(152),
        ),
      );
    });
  });

  describe("when parsing records", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          valueRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("X"),
          valueRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalIdentifier("One Variable"),
          valueRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });
  });
});
