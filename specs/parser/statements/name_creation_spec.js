import Immutable from "immutable";
import { nameCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import parse from "../../../app/oz/parser";

describe("Parsing name creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{NewName Y}")).toEqual(
      nameCreationStatementSyntax(lexicalIdentifier("Y")),
    );
  });
});
