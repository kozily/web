import Immutable from "immutable";
import { lexicalVariable } from "../../samples/lexical";
import { bindingStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("X=Y")).toEqual(
      bindingStatement(lexicalVariable("X"), lexicalVariable("Y")),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("Variable = OtherVariable")).toEqual(
      bindingStatement(
        lexicalVariable("Variable"),
        lexicalVariable("OtherVariable"),
      ),
    );
  });

  it("handles quoted variable syntax correctly", () => {
    expect(parse("`One Variable` = OtherVariable")).toEqual(
      bindingStatement(
        lexicalVariable("One Variable"),
        lexicalVariable("OtherVariable"),
      ),
    );
  });
});
