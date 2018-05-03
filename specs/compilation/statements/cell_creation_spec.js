import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { cellCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  cellCreationStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling cell creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = cellCreationStatementSyntax(
      identifier("X"),
      identifier("Y"),
    );

    expect(compile(statement)).toEqual(
      cellCreationStatement(identifier("X"), identifier("Y")),
    );
  });

  it("compiles expandable expressions in value position", () => {
    const statement = cellCreationStatementSyntax(
      functionExpression(identifier("Get")),
      identifier("Y"),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          cellCreationStatement(auxExpression(), identifier("Y")),
        ),
      ),
    );
  });

  it("compiles expandable expressions in cell position", () => {
    const statement = cellCreationStatementSyntax(
      identifier("Y"),
      functionExpression(identifier("Get")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          cellCreationStatement(identifier("Y"), auxExpression()),
        ),
      ),
    );
  });
});
