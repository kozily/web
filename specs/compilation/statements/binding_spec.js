import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  bindingStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  bindingStatement,
  skipStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalExpression,
  functionExpression,
} from "../../../app/oz/machine/expressions";
import {
  literalNumber,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling binding statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately when using identifiers", () => {
    const statement = bindingStatementSyntax(identifier("X"), identifier("Y"));

    expect(compile(statement)).toEqual(
      bindingStatement(identifier("X"), identifier("Y")),
    );
  });

  it("compiles appropriately when using simple values", () => {
    const statement = bindingStatementSyntax(
      identifier("X"),
      literalExpression(literalNumber(3)),
    );

    expect(compile(statement)).toEqual(
      bindingStatement(identifier("X"), literalExpression(literalNumber(3))),
    );
  });

  it("compiles appropriately when using procedures", () => {
    const statement = bindingStatementSyntax(
      identifier("X"),
      literalExpression(
        literalProcedure([lexicalIdentifier("X")], skipStatementSyntax()),
      ),
    );

    expect(compile(statement)).toEqual(
      bindingStatement(
        identifier("X"),
        literalExpression(
          literalProcedure([lexicalIdentifier("X")], skipStatement()),
        ),
      ),
    );
  });

  it("compiles appropriately when using expandable expressions on the lhs and an unbindable on the rhs", () => {
    const statement = bindingStatementSyntax(
      functionExpression(identifier("Get")),
      literalExpression(literalNumber(3)),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          bindingStatement(
            auxExpression(),
            literalExpression(literalNumber(3)),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when using expandable expressions on the rhs and an unbindable on the lhs", () => {
    const statement = bindingStatementSyntax(
      literalExpression(literalNumber(3)),
      functionExpression(identifier("Get")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(identifier("Get"), [auxExpression()]),
          bindingStatement(
            literalExpression(literalNumber(3)),
            auxExpression(),
          ),
        ),
      ),
    );
  });

  it("compiles appropriately when using expandable expressions on the lhs and an bindable on the rhs", () => {
    const statement = bindingStatementSyntax(
      identifier("X"),
      functionExpression(identifier("Get")),
    );

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(identifier("Get"), [identifier("X")]),
    );
  });

  it("compiles appropriately when using expandable expressions on the rhs and an bindable on the lhs", () => {
    const statement = bindingStatementSyntax(
      functionExpression(identifier("Get")),
      identifier("X"),
    );

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(identifier("Get"), [identifier("X")]),
    );
  });

  it("compiles appropriately when using expandable expressions on both sides", () => {
    const statement = bindingStatementSyntax(
      functionExpression(identifier("First")),
      functionExpression(identifier("Second")),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        auxExpressionIdentifier(2),
        sequenceStatement(
          procedureApplicationStatement(identifier("First"), [
            auxExpression(2),
          ]),
          localStatement(
            auxExpressionIdentifier(1),
            sequenceStatement(
              procedureApplicationStatement(identifier("Second"), [
                auxExpression(1),
              ]),
              bindingStatement(auxExpression(2), auxExpression(1)),
            ),
          ),
        ),
      ),
    );
  });
});
