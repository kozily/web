import Immutable from "immutable";
import {
  lexicalVariable,
  //lexicalNumber,
  lexicalRecord,
} from "../../samples/lexical";
import {
  patternMatchingStatement,
  sequenceStatement,
  skipStatement,
} from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when variable match pattern", () => {
    it("handles record with label and a feature", () => {
      expect(
        parse("case X of person(age:Age) then skip skip else skip end"),
      ).toEqual(
        patternMatchingStatement(
          lexicalVariable("X"),
          lexicalRecord("person", { age: lexicalVariable("Age") }),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
      );
    });

    it("handles record with label and features", () => {
      expect(
        parse(
          "case X of person(name:Name age:Age) then skip skip else skip end",
        ),
      ).toEqual(
        patternMatchingStatement(
          lexicalVariable("X"),
          lexicalRecord("person", {
            name: lexicalVariable("Name"),
            age: lexicalVariable("Age"),
          }),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
      );
    });
  });
});
