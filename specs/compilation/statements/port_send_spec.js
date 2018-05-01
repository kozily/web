import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { portSendStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  portSendStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling port send statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = portSendStatementSyntax(identifier("X"), identifier("Y"));

    expect(compile(statement)).toEqual(
      portSendStatement(identifier("X"), identifier("Y")),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = portSendStatementSyntax(
      functionExpression(identifier("X")),
      functionExpression(identifier("Y")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(2),
        sequenceStatement(
          procedureApplicationStatement(identifier("X"), [auxExpression(2)]),
          localStatement(
            auxExpressionIdentifier(1),
            sequenceStatement(
              procedureApplicationStatement(identifier("Y"), [
                auxExpression(1),
              ]),
              portSendStatement(auxExpression(2), auxExpression(1)),
            ),
          ),
        ),
      ),
    );
  });
});
