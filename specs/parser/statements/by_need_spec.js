import Immutable from "immutable";
import { byNeedStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import parse from "../../../app/oz/parser";

describe("Parsing by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{ByNeed X Y}")).toEqual(
      byNeedStatementSyntax(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
  });
});
