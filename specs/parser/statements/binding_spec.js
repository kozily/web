import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { bindingStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("X=Y")).toEqual(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("Variable = OtherVariable")).toEqual(
      bindingStatement(
        lexicalIdentifier("Variable"),
        lexicalIdentifier("OtherVariable"),
      ),
    );
  });

  it("handles quoted variable syntax correctly", () => {
    expect(parse("`One Variable` = OtherVariable")).toEqual(
      bindingStatement(
        lexicalIdentifier("One Variable"),
        lexicalIdentifier("OtherVariable"),
      ),
    );
  });
});
