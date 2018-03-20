import Immutable from "immutable";
import { literalString } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(valueGrammar);

describe("Parsing string values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles parsing correctly", () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(literalString("a \\\nSTRING"));
  });
});
