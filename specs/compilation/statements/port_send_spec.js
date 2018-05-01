import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { portSendStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { portSendStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Compiling port send statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = portSendStatementSyntax(
      identifierExpression(lexicalIdentifier("X")),
      identifierExpression(lexicalIdentifier("Y")),
    );

    expect(compile(statement)).toEqual(
      portSendStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
    );
  });
});
