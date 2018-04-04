import Immutable from "immutable";
import { literalBoolean } from "../../../app/oz/machine/literals";
import { parserFor } from "../../../app/oz/parser";
import literalGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(literalGrammar);

describe("Parsing boolean literals", () => {
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
