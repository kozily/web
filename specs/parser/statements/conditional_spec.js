import Immutable from "immutable";

import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalNumber } from "../../../app/oz/machine/literals";
import {
  operatorExpression,
  literalExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
  conditionalStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses simple if ... then ... else ... end statements", () => {
    expect(parse("if X then skip skip else skip end")).toEqual(
      conditionalStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        skipStatementSyntax(),
      ),
    );
  });

  it("parses simple if ... then ... end statements", () => {
    expect(parse("if X then skip end")).toEqual(
      conditionalStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        skipStatementSyntax(),
      ),
    );
  });

  it("handles condition expressions", () => {
    expect(parse("if 5 < 4 then skip else skip skip end")).toEqual(
      conditionalStatementSyntax(
        operatorExpression(
          "<",
          literalExpression(literalNumber(5)),
          literalExpression(literalNumber(4)),
        ),
        skipStatementSyntax(),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
      ),
    );
  });
});
