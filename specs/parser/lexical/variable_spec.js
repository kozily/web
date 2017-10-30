import Immutable from "immutable";
import { lexicalVariable } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical variable elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted variables correctly", () => {
    expect(parse("X")).toEqual(lexicalVariable("X"));
    expect(parse("OneVariable")).toEqual(lexicalVariable("OneVariable"));
  });

  it("handles quoted variables correctly", () => {
    expect(parse("`One Variable`")).toEqual(lexicalVariable("One Variable"));
    expect(parse("`One\\\\Variable`")).toEqual(
      lexicalVariable("One\\Variable"),
    );
  });
});
