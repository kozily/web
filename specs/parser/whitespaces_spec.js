import Immutable from "immutable";
import {
  skipStatementSyntax,
  localStatementSyntax,
  procedureApplicationStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import parse from "../../app/oz/parser";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Parsing whitespace around statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("   skip \n\t  ")).toEqual(skipStatementSyntax());
  });

  it("handles comments correctly", () => {
    expect(parse("   skip % this is a comment \n\t  ")).toEqual(
      skipStatementSyntax(),
    );
  });

  it("handles mixed inline comments correctly", () => {
    expect(
      parse(
        "  local X \n\r% this is a nested comment \n\r% local X \n\rin skip %this is a comment\n\r end ",
      ),
    ).toEqual(
      localStatementSyntax([lexicalIdentifier("X")], skipStatementSyntax()),
    );
  });

  it("handles nested comments correctly", () => {
    expect(
      parse(
        " /*  local X \n\r this is a nested comment \n\r */ local X in skip end ",
      ),
    ).toEqual(
      localStatementSyntax([lexicalIdentifier("X")], skipStatementSyntax()),
    );
  });

  it("handles question mark in parameter as documentation correctly", () => {
    expect(parse("{Sum A B ?C}")).toEqual(
      procedureApplicationStatementSyntax(
        identifierExpression(lexicalIdentifier("Sum")),
        [
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
          identifierExpression(lexicalIdentifier("C")),
        ],
      ),
    );
  });
});
