import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  skipStatementSyntax,
  localStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when using single variables", () => {
    it("handles declarations correctly", () => {
      expect(parse("local Variable in skip end")).toEqual(
        localStatementSyntax(
          [lexicalIdentifier("Variable")],
          skipStatementSyntax(),
        ),
      );
    });

    it("handles spaces correctly", () => {
      expect(parse("local Xyz in\n  skip\n end")).toEqual(
        localStatementSyntax([lexicalIdentifier("Xyz")], skipStatementSyntax()),
      );
    });
  });

  describe("when using multiple variables", () => {
    it("handles declarations correctly", () => {
      expect(parse("local X Y Variable in skip end")).toEqual(
        localStatementSyntax(
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("Y"),
            lexicalIdentifier("Variable"),
          ],
          skipStatementSyntax(),
        ),
      );
    });

    it("handles declarations correctly", () => {
      expect(parse("local X \nY\t Variable \n\t   in\n  skip\nend")).toEqual(
        localStatementSyntax(
          [
            lexicalIdentifier("X"),
            lexicalIdentifier("Y"),
            lexicalIdentifier("Variable"),
          ],
          skipStatementSyntax(),
        ),
      );
    });
  });
});
