import Immutable from "immutable";
import { booleanExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing boolean literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles true correctly", () => {
    expect(parse("true")).toEqual(booleanExpression(true));
  });

  it("handles false correctly", () => {
    expect(parse("false")).toEqual(booleanExpression(false));
  });
});
