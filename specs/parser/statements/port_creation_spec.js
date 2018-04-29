import Immutable from "immutable";
import { portCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import parse from "../../../app/oz/parser";

describe("Parsing port creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{NewPort X Y}")).toEqual(
      portCreationStatementSyntax(
        lexicalIdentifier("X"),
        lexicalIdentifier("Y"),
      ),
    );
  });
});
