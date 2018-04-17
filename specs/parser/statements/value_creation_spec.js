import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalNumber,
  literalRecord,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import { operatorExpression } from "../../../app/oz/machine/expressions";
import {
  valueCreationStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing X=VALUE statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when parsing numbers", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=5")).toEqual(
        valueCreationStatementSyntax(lexicalIdentifier("X"), literalNumber(5)),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("Variable = 12.0")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("Variable"),
          literalNumber(12.0),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = 152")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("One Variable"),
          literalNumber(152),
        ),
      );
    });
  });

  describe("when parsing records", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=person(name:N)")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("X"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = person(name:N)")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("X"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = person(name:N)")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("One Variable"),
          literalRecord("person", { name: lexicalIdentifier("N") }),
        ),
      );
    });
  });

  describe("when parsing procedures", () => {
    it("handles condensed syntax correctly", () => {
      expect(parse("X=proc{$ X Y} skip end")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("X"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatementSyntax(),
          ),
        ),
      );
    });

    it("handles spaced syntax correctly", () => {
      expect(parse("X = proc{$ X Y} skip end")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("X"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatementSyntax(),
          ),
        ),
      );
    });

    it("handles quoted variable syntax correctly", () => {
      expect(parse("`One Variable` = proc{$ X Y} skip end")).toEqual(
        valueCreationStatementSyntax(
          lexicalIdentifier("One Variable"),
          literalProcedure(
            [lexicalIdentifier("X"), lexicalIdentifier("Y")],
            skipStatementSyntax(),
          ),
        ),
      );
    });
  });

  it("handles rhs expressions", () => {
    expect(parse("X = 2 + 3")).toEqual(
      valueCreationStatementSyntax(
        lexicalIdentifier("X"),
        operatorExpression("+", literalNumber(2), literalNumber(3)),
      ),
    );
  });
});
