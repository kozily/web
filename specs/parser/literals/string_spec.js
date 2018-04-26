import Immutable from "immutable";
import { literalString } from "../../../app/oz/machine/literals";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing string literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles parsing simple strings correctly", () => {
    expect(parse('"ABC"')).toEqual(literalString("ABC"));
  });

  it("handles parsing complex strings correctly", () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(literalString("a \\\nSTRING"));
  });
});
