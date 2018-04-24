import Immutable from "immutable";
import { identifierExpression } from "../../../app/oz/machine/expressions";
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
        procedureApplicationStatementSyntax(
          identifierExpression(lexicalIdentifier("SomeProcedure")),
        ),
      );
    });

    it("handles whitespaced syntax correctly", () => {
      expect(parse("{\n   SomeProcedure\t\t  \n}")).toEqual(
        procedureApplicationStatementSyntax(
          identifierExpression(lexicalIdentifier("SomeProcedure")),
        ),
      );
    });
  });

  describe("when arguments are provided", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("{SomeProcedure FirstArgument SecondArgument}")).toEqual(
        procedureApplicationStatementSyntax(
          identifierExpression(lexicalIdentifier("SomeProcedure")),
          [
            identifierExpression(lexicalIdentifier("FirstArgument")),
            identifierExpression(lexicalIdentifier("SecondArgument")),
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
          identifierExpression(lexicalIdentifier("SomeProcedure")),
          [
            identifierExpression(lexicalIdentifier("FirstArgument")),
            identifierExpression(lexicalIdentifier("SecondArgument")),
          ],
        ),
      );
    });
  });
});
