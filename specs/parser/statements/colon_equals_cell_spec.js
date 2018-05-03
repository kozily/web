import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { colonEqualsCellStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing C:=X statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("C:=X")).toEqual(
      colonEqualsCellStatementSyntax(
        identifierExpression(lexicalIdentifier("C")),
        identifierExpression(lexicalIdentifier("X")),
      ),
    );
  });
});
