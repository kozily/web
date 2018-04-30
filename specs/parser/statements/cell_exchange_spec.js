import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { cellExchangeStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing cell exchange statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("{Exchange X Y Z}")).toEqual(
      cellExchangeStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
        identifierExpression(lexicalIdentifier("Z")),
      ),
    );
  });
});
