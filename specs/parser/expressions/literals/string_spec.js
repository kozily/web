import Immutable from "immutable";
import { stringExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing string literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles parsing empty strings correctly", () => {
    expect(parse('""')).toEqual(stringExpression(""));
  });

  it("handles parsing super simple strings correclty", () => {
    expect(parse('"A"')).toEqual(stringExpression("A"));
  });

  it("handles parsing simple strings correctly", () => {
    expect(parse('"ABC"')).toEqual(stringExpression("ABC"));
  });

  it("handles parsing complex strings correctly", () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(
      stringExpression("a \\\nSTRING"),
    );
  });
});
