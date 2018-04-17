import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing identifiers expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses identifiers successfully", () => {
    expect(parse("OneVariable")).toEqual(lexicalIdentifier("OneVariable"));
  });
});
