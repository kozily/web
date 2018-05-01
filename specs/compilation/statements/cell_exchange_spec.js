import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { cellExchangeStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  cellExchangeStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { functionExpression } from "../../../app/oz/machine/expressions";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling cell exchange statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles unexpandable expressions", () => {
    const statement = cellExchangeStatementSyntax(
      identifier("X"),
      lexicalIdentifier("Y"),
      identifier("Z"),
    );

    expect(compile(statement)).toEqual(
      cellExchangeStatement(
        identifier("X"),
        lexicalIdentifier("Y"),
        identifier("Z"),
      ),
    );
  });

  it("compiles expandable expressions", () => {
    const statement = cellExchangeStatementSyntax(
      functionExpression(identifier("GetX")),
      lexicalIdentifier("Y"),
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
                lexicalIdentifier("Y"),
                auxExpression(1),
              ),
            ),
          ),
        ),
      ),
    );
  });
});
