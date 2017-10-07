import Immutable from "immutable";
import lexical from "../../samples/lexical";
import statements from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("local Variable in skip end")).toEqual(
      statements.local(lexical.variable("Variable"), statements.skip()),
    );
  });

  it("handles spaces correctly", () => {
    expect(parse("local Xyz in\n  skip\n end")).toEqual(
      statements.local(lexical.variable("Xyz"), statements.skip()),
    );
  });
});
