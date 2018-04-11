import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { exceptionRaiseStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling exception raise statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = exceptionRaiseStatementSyntax(lexicalIdentifier("X"));

    expect(compile(statement)).toEqual(
      exceptionRaiseStatement(lexicalIdentifier("X")),
    );
  });
});
