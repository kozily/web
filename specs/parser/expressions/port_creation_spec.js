import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import { portCreationExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

const parse = parserFor(expressionsGrammar);

describe("Parsing port creation statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses", () => {
    expect(parse("{NewPort X}")).toEqual(
      portCreationExpression(lexicalIdentifier("X")),
    );
  });
});
