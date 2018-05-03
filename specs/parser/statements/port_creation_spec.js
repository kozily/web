import Immutable from "immutable";
import { portCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import parse from "../../../app/oz/parser";

describe("Parsing port creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{NewPort X Y}")).toEqual(
      portCreationStatementSyntax(
        lexicalIdentifier("X"),
        identifierExpression(lexicalIdentifier("Y")),
      ),
    );
  });
});
