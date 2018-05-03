import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { nameCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  nameCreationStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling name creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = nameCreationStatementSyntax(identifier("Y"));

    expect(compile(statement)).toEqual(nameCreationStatement(identifier("Y")));
  });

  it("compiles expandable expressions appropriately", () => {
    const statement = nameCreationStatementSyntax(
      functionExpression(identifier("Get")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          nameCreationStatement(auxExpression()),
        ),
      ),
    );
  });
});
