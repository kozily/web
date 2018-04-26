import Immutable from "immutable";
import { cellCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import parse from "../../../app/oz/parser";

describe("Parsing cell creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{NewCell X Y}")).toEqual(
      cellCreationStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
