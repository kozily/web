import Immutable from "immutable";
import { literalBoolean } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(valueGrammar);

describe("Parsing boolean values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles true correctly", () => {
    expect(parse("true")).toEqual(literalBoolean(true));
  });

  it("handles false correctly", () => {
    expect(parse("false")).toEqual(literalBoolean(false));
  });
});
