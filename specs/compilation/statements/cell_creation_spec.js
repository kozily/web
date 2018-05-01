import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { cellCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  cellCreationStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling cell creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = cellCreationStatementSyntax(
      identifier("X"),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      cellCreationStatement(identifier("X"), lexicalIdentifier("Y")),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = cellCreationStatementSyntax(
      functionExpression(identifier("Get")),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          cellCreationStatement(auxExpression(), lexicalIdentifier("Y")),
        ),
      ),
    );
  });
});
