import Immutable from "immutable";
import { lexicalIdentifier } from "../../../../app/oz/machine/lexical";
import { procedureExpression } from "./helpers";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../../app/oz/machine/statementSyntax.js";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing procedure literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("without arguments", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("proc {$} skip skip end")).toEqual(
        procedureExpression(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles condensed syntax", () => {
      expect(parse("proc{$}skip skip end")).toEqual(
        procedureExpression(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("proc {  $\t\n} \n\tskip\n\tskip\nend")).toEqual(
        procedureExpression(
          [],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });

  describe("with argumens", () => {
    it("handles standard spaced syntax", () => {
      expect(parse("proc {$ X Y} skip skip end")).toEqual(
        procedureExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles condensed syntax", () => {
      expect(parse("proc{$ X Y}skip skip end")).toEqual(
        procedureExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });

    it("handles weird spacing", () => {
      expect(parse("proc {  $\tX Y\n} \n\tskip\n\tskip\nend")).toEqual(
        procedureExpression(
          [lexicalIdentifier("X"), lexicalIdentifier("Y")],
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });
});
