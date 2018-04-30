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
  bindingStatementSyntax,
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
        [
          {
            pattern: literalRecord("person", {
              name: lexicalIdentifier("Name"),
              age: lexicalIdentifier("Age"),
            }),
            statement: sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });

  it("handles record with label and no features", () => {
    expect(parse("case X of person then skip skip else skip end")).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });

  it("handles multiple pattern cases", () => {
    expect(
      parse(
        "case X of person then A = B [] animal then B = C [] mineral then C = D else skip end",
      ),
    ).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
          },
          {
            pattern: literalRecord("animal"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("B")),
              identifierExpression(lexicalIdentifier("C")),
            ),
          },
          {
            pattern: literalRecord("mineral"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });

  it("handles no else clause", () => {
    expect(parse("case X of person then skip end")).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: skipStatementSyntax(),
          },
        ],
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
        [
          {
            pattern: literalRecord("person"),
            statement: sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });
});
