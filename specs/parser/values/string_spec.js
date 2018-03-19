import Immutable from "immutable";
import { valueString } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing string values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles parsing correctly", () => {
    expect(parse('"a \\\\\\nSTRING"')).toEqual(valueString("a \\\nSTRING"));
  });
});
