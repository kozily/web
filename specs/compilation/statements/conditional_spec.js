import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { functionExpression } from "../../../app/oz/machine/expressions";
import {
  conditionalStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  conditionalStatement,
  skipStatement,
  bindingStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = conditionalStatementSyntax(
      identifier("X"),
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(identifier("X"), skipStatement(), skipStatement()),
    );
  });

  it("compiles expandable expresions", () => {
    const statement = conditionalStatementSyntax(
      functionExpression(identifier("Get")),
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          conditionalStatement(
            auxExpression(),
            skipStatement(),
            skipStatement(),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately conditionals without else", () => {
    const statement = conditionalStatementSyntax(
      identifier("X"),
      bindingStatementSyntax(identifier("A"), identifier("B")),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(
        identifier("X"),
        bindingStatement(identifier("A"), identifier("B")),
        skipStatement(),
      ),
    );
  });
});
