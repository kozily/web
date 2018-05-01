import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { exceptionRaiseStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { exceptionRaiseStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Compiling exception raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = exceptionRaiseStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
    );

    expect(compile(statement)).toEqual(
      exceptionRaiseStatement(identifierExpression(lexicalIdentifier("X"))),
    );
  });
});
