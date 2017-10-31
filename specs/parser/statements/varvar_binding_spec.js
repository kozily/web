import Immutable from "immutable";
import lexical from "../../samples/lexical";
import statements from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("X=Y")).toEqual(
      statements.binding(lexical.variable("X"), lexical.variable("Y")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("Variable = OtherVariable")).toEqual(
      statements.binding(
        lexical.variable("Variable"),
        lexical.variable("OtherVariable"),
      ),
    );
  });

  it("handles quoted variable syntax correctly", () => {
    expect(parse("`One Variable` = OtherVariable")).toEqual(
      statements.binding(
        lexical.variable("One Variable"),
        lexical.variable("OtherVariable"),
      ),
    );
  });
});
