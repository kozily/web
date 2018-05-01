import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { functionExpression } from "../../../app/oz/machine/expressions";
import {
  patternMatchingStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  patternMatchingStatement,
  skipStatement,
  bindingStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { literalRecord } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling patternMatching statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately simple cases", () => {
    const statement = patternMatchingStatementSyntax(
      identifier("X"),
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
        identifier("X"),
        literalRecord("person"),
        skipStatement(),
        skipStatement(),
      ),
    );
  });

  it("compiles appropriately multiple pattern cases", () => {
    const statement = patternMatchingStatementSyntax(
      identifier("X"),
      [
        {
          pattern: literalRecord("person"),
          statement: bindingStatementSyntax(identifier("A"), identifier("B")),
        },
        {
          pattern: literalRecord("animal"),
          statement: bindingStatementSyntax(identifier("B"), identifier("C")),
        },
        {
          pattern: literalRecord("mineral"),
          statement: bindingStatementSyntax(identifier("C"), identifier("D")),
        },
      ],
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifier("X"),
        literalRecord("person"),
        bindingStatement(identifier("A"), identifier("B")),
        patternMatchingStatement(
          identifier("X"),
          literalRecord("animal"),
          bindingStatement(identifier("B"), identifier("C")),
          patternMatchingStatement(
            identifier("X"),
            literalRecord("mineral"),
            bindingStatement(identifier("C"), identifier("D")),
            skipStatement(),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when not having else clause", () => {
    const statement = patternMatchingStatementSyntax(identifier("X"), [
      {
        pattern: literalRecord("person"),
        statement: bindingStatementSyntax(identifier("A"), identifier("B")),
      },
    ]);

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifier("X"),
        literalRecord("person"),
        bindingStatement(identifier("A"), identifier("B")),
        skipStatement(),
      ),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = patternMatchingStatementSyntax(
      functionExpression(identifier("Get")),
      [
        {
          pattern: literalRecord("person"),
          statement: bindingStatementSyntax(identifier("A"), identifier("B")),
        },
      ],
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),

          patternMatchingStatement(
            auxExpression(),
            literalRecord("person"),
            bindingStatement(identifier("A"), identifier("B")),
            skipStatement(),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when using any identifier", () => {
    const statement = patternMatchingStatementSyntax(identifier("X"), [
      {
        pattern: literalRecord("person"),
        statement: bindingStatementSyntax(identifier("_"), identifier("B")),
      },
    ]);

    expect(compile(statement)).toEqual(
      patternMatchingStatement(
        identifier("X"),
        literalRecord("person"),
        bindingStatement(identifier("_"), identifier("B")),
        skipStatement(),
      ),
    );
  });
});
