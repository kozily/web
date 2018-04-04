import Immutable from "immutable";
import { skipStatement } from "../../app/oz/machine/statements";
import parse from "../../app/oz/parser";

describe("Parsing whitespace around statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("   skip \n\t  ")).toEqual(skipStatement());
  });
});
