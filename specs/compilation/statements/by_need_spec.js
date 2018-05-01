import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { byNeedStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  byNeedStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling by need statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = byNeedStatementSyntax(
      identifier("X"),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      byNeedStatement(identifier("X"), lexicalIdentifier("Y")),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = byNeedStatementSyntax(
      functionExpression(identifier("Get")),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          byNeedStatement(auxExpression(), lexicalIdentifier("Y")),
        ),
      ),
    );
  });
});
