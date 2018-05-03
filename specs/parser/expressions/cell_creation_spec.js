import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import { cellCreationExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

const parse = parserFor(expressionsGrammar);

describe("Parsing cell creation statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses", () => {
    expect(parse("{NewCell X}")).toEqual(
      cellCreationExpression(identifierExpression(lexicalIdentifier("X"))),
    );
  });
});
