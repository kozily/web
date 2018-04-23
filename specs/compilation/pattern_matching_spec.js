import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { identifierExpression } from "../../app/oz/machine/expressions";
import {
  patternMatchingStatementSyntax,
  skipStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  patternMatchingStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalRecord } from "../../app/oz/machine/literals";

describe("Compiling patternMatching statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = patternMatchingStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      literalRecord("person"),
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalRecord("person"),
        skipStatement(),
        skipStatement(),
      ),
    );
  });
});
