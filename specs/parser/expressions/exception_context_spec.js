import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import {
  exceptionContextExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";

const parse = parserFor(expressionsGrammar);

describe("Parsing exception context statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses when there are inner statements", () => {
    expect(parse("try skip 5 catch Error then skip skip 10 end")).toEqual(
      exceptionContextExpression(
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(10)),
        },
        lexicalIdentifier("Error"),
      ),
    );
  });

  it("parses when there are no inner statements", () => {
    expect(parse("try 5 catch Error then 10 end")).toEqual(
      exceptionContextExpression(
        {
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
        lexicalIdentifier("Error"),
      ),
    );
  });
});
