import Immutable from "immutable";
import { functionExpression, numberExpression } from "./helpers";
import { lexicalIdentifier } from "../../../../app/oz/machine/lexical";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../../app/oz/machine/statementSyntax.js";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing function literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("without arguments", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("fun {$} 5 end")).toEqual(
        functionExpression([], numberExpression(5)),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("fun {  $\t\n} \n\t5\nend")).toEqual(
        functionExpression([], numberExpression(5)),
      );
    });
  });

  describe("with argumens", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("fun {$ X Y} 5 end")).toEqual(
        functionExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          numberExpression(5),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("fun {  $\tX Y\n} \n\t5\n end")).toEqual(
        functionExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          numberExpression(5),
        ),
      );
    });
  });

  describe("with statements and expressions", () => {
    it("handles a single statement correctly", () => {
      expect(parse("fun {$ X Y} skip 5 end")).toEqual(
        functionExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          numberExpression(5),
          skipStatementSyntax(),
        ),
      );
    });

    it("handles multiple statements correctly", () => {
      expect(parse("fun {$ X Y} skip skip 5 end")).toEqual(
        functionExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          numberExpression(5),
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });
});
