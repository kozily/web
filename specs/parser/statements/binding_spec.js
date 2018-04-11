import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { bindingStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("X=Y")).toEqual(
      bindingStatementSyntax(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("Variable = OtherVariable")).toEqual(
      bindingStatementSyntax(
        lexicalIdentifier("Variable"),
        lexicalIdentifier("OtherVariable"),
      ),
    );
  });

  it("handles quoted variable syntax correctly", () => {
    expect(parse("`One Variable` = OtherVariable")).toEqual(
      bindingStatementSyntax(
        lexicalIdentifier("One Variable"),
        lexicalIdentifier("OtherVariable"),
      ),
    );
  });
});
