import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { colonEqualsCellStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  cellExchangeStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling C:=X statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = colonEqualsCellStatementSyntax(
      identifier("C"),
      identifier("X"),
    );

    expect(compile(statement)).toEqual(
      cellExchangeStatement(
        identifier("C"),
        lexicalIdentifier("_"),
        identifier("X"),
      ),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = colonEqualsCellStatementSyntax(
      functionExpression(identifier("GetX")),
      functionExpression(identifier("GetY")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(2),
        sequenceStatement(
          procedureApplicationStatement(identifier("GetX"), [auxExpression(2)]),
          localStatement(
            auxExpressionIdentifier(1),
            sequenceStatement(
              procedureApplicationStatement(identifier("GetY"), [
                auxExpression(1),
              ]),
              cellExchangeStatement(
                auxExpression(2),
                lexicalIdentifier("_"),
                auxExpression(1),
              ),
            ),
          ),
        ),
      ),
    );
  });
});
