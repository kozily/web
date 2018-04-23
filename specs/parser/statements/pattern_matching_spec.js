import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { literalRecord } from "../../../app/oz/machine/literals";
import {
  patternMatchingStatementSyntax,
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles record with label and features", () => {
    expect(
      parse("case X of person(name:Name age:Age) then skip skip else skip end"),
    ).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        literalRecord("person", {
          name: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        skipStatementSyntax(),
      ),
    );
  });

  it("handles record with label and no features", () => {
    expect(parse("case X of person then skip skip else skip end")).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        literalRecord("person"),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        skipStatementSyntax(),
      ),
    );
  });

  it("handles expressions", () => {
    expect(parse("case A + B of person then skip skip else skip end")).toEqual(
      patternMatchingStatementSyntax(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        literalRecord("person"),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        skipStatementSyntax(),
      ),
    );
  });
});
