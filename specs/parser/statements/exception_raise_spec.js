import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { exceptionRaiseStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("raise X end")).toEqual(
      exceptionRaiseStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
      ),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("raise\n\t     X\n\nend")).toEqual(
      exceptionRaiseStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
      ),
    );
  });
});
