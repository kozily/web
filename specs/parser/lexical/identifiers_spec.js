import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.ne";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical identifier elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles unquoted identifiers correctly", () => {
    expect(parse("X")).toEqual(lexicalIdentifier("X"));
    expect(parse("OneVariable")).toEqual(lexicalIdentifier("OneVariable"));
  });

  it("handles quoted identifiers correctly", () => {
    expect(parse("`One Variable`")).toEqual(lexicalIdentifier("One Variable"));
    expect(parse("`One\\\\Variable`")).toEqual(
      lexicalIdentifier("One\\Variable"),
    );
  });
});
