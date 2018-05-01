import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { exceptionRaiseStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  exceptionRaiseStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling exception raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = exceptionRaiseStatementSyntax(identifier("X"));

    expect(compile(statement)).toEqual(
      exceptionRaiseStatement(identifier("X")),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = exceptionRaiseStatementSyntax(
      functionExpression(identifier("Get")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          exceptionRaiseStatement(auxExpression()),
        ),
      ),
    );
  });
});
