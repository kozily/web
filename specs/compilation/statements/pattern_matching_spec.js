import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import {
  patternMatchingStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  patternMatchingStatement,
  skipStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalRecord } from "../../../app/oz/machine/literals";

describe("Compiling patternMatching statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately simple cases", () => {
    const statement = patternMatchingStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      [
        {
          pattern: literalRecord("person"),
          statement: skipStatementSyntax(),
        },
      ],
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

  it("compiles appropriately multiple pattern cases", () => {
    const statement = patternMatchingStatementSyntax(
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
    );

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalRecord("person"),
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        patternMatchingStatement(
          identifierExpression(lexicalIdentifier("X")),
          literalRecord("animal"),
          bindingStatement(
            identifierExpression(lexicalIdentifier("B")),
            identifierExpression(lexicalIdentifier("C")),
          ),
          patternMatchingStatement(
            identifierExpression(lexicalIdentifier("X")),
            literalRecord("mineral"),
            bindingStatement(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            skipStatement(),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when not having else clause", () => {
    const statement = patternMatchingStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      [
        {
          pattern: literalRecord("person"),
          statement: bindingStatementSyntax(
            identifierExpression(lexicalIdentifier("A")),
            identifierExpression(lexicalIdentifier("B")),
          ),
        },
      ],
    );

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifierExpression(lexicalIdentifier("X")),
        literalRecord("person"),
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        skipStatement(),
      ),
    );
  });
});
