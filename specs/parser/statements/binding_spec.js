import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalNumber,
  literalRecord,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import {
  operatorExpression,
  literalExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import {
  bindingStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing binding statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing numbers", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=5")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(5)),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("Variable = 12.0")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("Variable")),
          literalExpression(literalNumber(12.0)),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = 152")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("One Variable")),
          literalExpression(literalNumber(152)),
        ),
      );
    });
  });

  describe("when parsing records", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=person(name:N)")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(
            literalRecord("person", { name: lexicalIdentifier("N") }),
          ),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = person(name:N)")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(
            literalRecord("person", { name: lexicalIdentifier("N") }),
          ),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = person(name:N)")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("One Variable")),
          literalExpression(
            literalRecord("person", { name: lexicalIdentifier("N") }),
          ),
        ),
      );
    });
  });

  describe("when parsing procedures", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=proc{$ X Y} skip end")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(
            literalProcedure(
              [lexicalIdentifier("X"), lexicalIdentifier("Y")],
              skipStatementSyntax(),
            ),
          ),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = proc{$ X Y} skip end")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(
            literalProcedure(
              [lexicalIdentifier("X"), lexicalIdentifier("Y")],
              skipStatementSyntax(),
            ),
          ),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = proc{$ X Y} skip end")).toEqual(
        bindingStatementSyntax(
          identifierExpression(lexicalIdentifier("One Variable")),
          literalExpression(
            literalProcedure(
              [lexicalIdentifier("X"), lexicalIdentifier("Y")],
              skipStatementSyntax(),
            ),
          ),
        ),
      );
    });
  });

  it("handles rhs expressions", () => {
    expect(parse("X = 2 + 3")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        operatorExpression(
          "+",
          literalExpression(literalNumber(2)),
          literalExpression(literalNumber(3)),
        ),
      ),
    );
  });
});
