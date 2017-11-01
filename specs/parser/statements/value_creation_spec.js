import Immutable from "immutable";
import {
  lexicalVariable,
  lexicalNumber,
  lexicalRecord,
} from "../../samples/lexical";
import { valueCreationStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing numbers", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=5")).toEqual(
        valueCreationStatement(lexicalVariable("X"), lexicalNumber(5)),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("Variable = 12.0")).toEqual(
        valueCreationStatement(
          lexicalVariable("Variable"),
          lexicalNumber(12.0),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = 152")).toEqual(
        valueCreationStatement(
          lexicalVariable("One Variable"),
          lexicalNumber(152),
        ),
      );
    });
  });

  describe("when parsing records", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalVariable("X"),
          lexicalRecord("person", { name: lexicalVariable("N") }),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalVariable("X"),
          lexicalRecord("person", { name: lexicalVariable("N") }),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = person(name:N)")).toEqual(
        valueCreationStatement(
          lexicalVariable("One Variable"),
          lexicalRecord("person", { name: lexicalVariable("N") }),
        ),
      );
    });
  });
});
