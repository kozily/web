import Immutable from "immutable";
import { lexicalBoolean } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical boolean elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles true correctly", () => {
    expect(parse("true")).toEqual(lexicalBoolean(true));
  });

  it("handles false correctly", () => {
    expect(parse("false")).toEqual(lexicalBoolean(false));
  });
});
