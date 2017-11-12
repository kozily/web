import Immutable from "immutable";

import { lexicalVariable } from "../../samples/lexical";
import {
  sequenceStatement,
  skipStatement,
  conditionalStatement,
} from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when condition is a variable", () => {
    it("when is composed by two statement in the true statement", () => {
      expect(parse("if X then skip skip else skip end")).toEqual(
        conditionalStatement(
          lexicalVariable("X"),
          sequenceStatement(skipStatement(), skipStatement()),
          skipStatement(),
        ),
      );
    });

    it("when is composed by two statements in the false statement", () => {
      expect(parse("if X then skip else skip skip end")).toEqual(
        conditionalStatement(
          lexicalVariable("X"),
          skipStatement(),
          sequenceStatement(skipStatement(), skipStatement()),
        ),
      );
    });
  });
});
