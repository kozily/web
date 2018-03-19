import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { skipStatement, localStatement } from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing local X in ... end statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("local Variable in skip end")).toEqual(
      localStatement(lexicalIdentifier("Variable"), skipStatement()),
    );
  });

  it("handles spaces correctly", () => {
    expect(parse("local Xyz in\n  skip\n end")).toEqual(
      localStatement(lexicalIdentifier("Xyz"), skipStatement()),
    );
  });
});
