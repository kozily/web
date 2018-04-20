import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { procedureApplicationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing {X ...} statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when no arguments are provided", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("{SomeProcedure}")).toEqual(
        procedureApplicationStatementSyntax(lexicalIdentifier("SomeProcedure")),
      );
    });

    it("handles whitespaced syntax correctly", () => {
      expect(parse("{\n   SomeProcedure\t\t  \n}")).toEqual(
        procedureApplicationStatementSyntax(lexicalIdentifier("SomeProcedure")),
      );
    });
  });

  describe("when arguments are provided", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("{SomeProcedure FirstArgument SecondArgument}")).toEqual(
        procedureApplicationStatementSyntax(
          lexicalIdentifier("SomeProcedure"),
          [
            lexicalIdentifier("FirstArgument"),
            lexicalIdentifier("SecondArgument"),
          ],
        ),
      );
    });

    it("handles whitespaced syntax correctly", () => {
      expect(
        parse(
          "{\n   SomeProcedure \t   FirstArgument      SecondArgument\n\t}",
        ),
      ).toEqual(
        procedureApplicationStatementSyntax(
          lexicalIdentifier("SomeProcedure"),
          [
            lexicalIdentifier("FirstArgument"),
            lexicalIdentifier("SecondArgument"),
          ],
        ),
      );
    });
  });
});
