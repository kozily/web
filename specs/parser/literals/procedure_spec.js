import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalProcedure } from "../../../app/oz/machine/literals";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax.js";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing procedure literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("without arguments", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("proc {$} skip skip end")).toEqual(
        literalProcedure(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles condensed syntax", () => {
      expect(parse("proc{$}skip skip end")).toEqual(
        literalProcedure(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("proc {  $\t\n} \n\tskip\n\tskip\nend")).toEqual(
        literalProcedure(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });

  describe("with argumens", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("proc {$ X Y} skip skip end")).toEqual(
        literalProcedure(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles condensed syntax", () => {
      expect(parse("proc{$ X Y}skip skip end")).toEqual(
        literalProcedure(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("proc {  $\tX Y\n} \n\tskip\n\tskip\nend")).toEqual(
        literalProcedure(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });
});
