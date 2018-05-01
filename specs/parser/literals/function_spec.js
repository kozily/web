import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalExpression } from "../../../app/oz/machine/expressions";
import {
  literalFunction,
  literalNumber,
} from "../../../app/oz/machine/literals";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax.js";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing function literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("without arguments", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("fun {$} 5 end")).toEqual(
        literalFunction([], literalExpression(literalNumber(5))),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("fun {  $\t\n} \n\t5\nend")).toEqual(
        literalFunction([], literalExpression(literalNumber(5))),
      );
    });
  });

  describe("with argumens", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("fun {$ X Y} 5 end")).toEqual(
        literalFunction(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          literalExpression(literalNumber(5)),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("fun {  $\tX Y\n} \n\t5\n end")).toEqual(
        literalFunction(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          literalExpression(literalNumber(5)),
        ),
      );
    });
  });

  describe("with statements and expressions", () => {
    it("handles a single statement correctly", () => {
      expect(parse("fun {$ X Y} skip 5 end")).toEqual(
        literalFunction(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          literalExpression(literalNumber(5)),
          skipStatementSyntax(),
        ),
      );
    });

    it("handles multiple statements correctly", () => {
      expect(parse("fun {$ X Y} skip skip 5 end")).toEqual(
        literalFunction(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          literalExpression(literalNumber(5)),
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });
});
