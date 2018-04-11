import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { bindingStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { bindingStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling binding statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = bindingStatementSyntax(
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
  });
});
