import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import {
  conditionalExpression,
  literalExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";

const parse = parserFor(expressionsGrammar);

describe("Parsing conditional statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses simple if ... then ... else ... end statements", () => {
    expect(parse("if X then skip 5 else skip skip 10 end")).toEqual(
      conditionalExpression(
        identifierExpression(lexicalIdentifier("X")),
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
      ),
    );
  });

  it("parses simple if ... then ... else ... end statements without statements in the clauses", () => {
    expect(parse("if X then 5 else 10 end")).toEqual(
      conditionalExpression(
        identifierExpression(lexicalIdentifier("X")),
        {
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      ),
    );
  });

  it("parses simple if ... then ... end statements", () => {
    expect(parse("if X then skip 5 end")).toEqual(
      conditionalExpression(identifierExpression(lexicalIdentifier("X")), {
        statement: skipStatementSyntax(),
        expression: literalExpression(literalNumber(5)),
      }),
    );
  });
});
