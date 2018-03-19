import Immutable from "immutable";
import { valueBoolean } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing boolean values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles true correctly", () => {
    expect(parse("true")).toEqual(valueBoolean(true));
  });

  it("handles false correctly", () => {
    expect(parse("false")).toEqual(valueBoolean(false));
  });
});
