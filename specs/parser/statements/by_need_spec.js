import Immutable from "immutable";
import { byNeedStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import parse from "../../../app/oz/parser";

describe("Parsing by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{ByNeed X Y}")).toEqual(
      byNeedStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
