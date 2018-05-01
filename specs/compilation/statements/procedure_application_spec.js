import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { procedureApplicationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  procedureApplicationStatement,
  localStatement,
  sequenceStatement,
} from "../../../app/oz/machine/statements";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling procedure application statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = procedureApplicationStatementSyntax(identifier("P"), [
      identifier("A"),
      identifier("B"),
    ]);

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(identifier("P"), [
        identifier("A"),
        identifier("B"),
      ]),
    );
  });

  it("compiles expandable expressions in procedure and argument position", () => {
    const statement = procedureApplicationStatementSyntax(
      functionExpression(identifier("Proc")),
      [functionExpression(identifier("Arg"))],
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(2),
        sequenceStatement(
          procedureApplicationStatement(identifier("Proc"), [auxExpression(2)]),
          localStatement(
            auxExpressionIdentifier(1),
            sequenceStatement(
              procedureApplicationStatement(identifier("Arg"), [
                auxExpression(1),
              ]),
              procedureApplicationStatement(auxExpression(2), [
                auxExpression(1),
              ]),
            ),
          ),
        ),
      ),
    );
  });
});
