import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import {
  localExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";

const parse = parserFor(expressionsGrammar);

describe("Parsing local statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses", () => {
    expect(parse("local X Y in skip 5 end")).toEqual(
      localExpression(
        [lexicalIdentifier("X"), lexicalIdentifier("Y")],
        literalExpression(literalNumber(5)),
        skipStatementSyntax(),
      ),
    );
  });
});
