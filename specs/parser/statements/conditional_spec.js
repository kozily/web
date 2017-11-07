import Immutable from "immutable";

import {
  lexicalVariable,
  /*
  lexicalNumber,
  lexicalRecord,
  */
} from "../../samples/lexical";

import { skipStatement, conditionalStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when condition is true", () => {
    it("when is composed by true statement and without a false statement", () => {
      expect(parse("if X then skip end")).toEqual(
        conditionalStatement(lexicalVariable("X"), skipStatement()),
      );
    });

    it("when is composed by true statement and a false statement", () => {
      expect(parse("if X then skip else skip end")).toEqual(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          skipStatement(),
        ),
      );
    });
  });

  describe("when condition is false", () => {
    it("when is composed by true statement and a false statement", () => {
      expect(parse("if X then skip else skip end")).toEqual(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          skipStatement(),
        ),
      );
    });
  });
});
