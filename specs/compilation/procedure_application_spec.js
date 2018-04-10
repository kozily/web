import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { procedureApplicationStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { procedureApplicationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling procedure application statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = procedureApplicationStatementSyntax(
      lexicalIdentifier("Sum"),
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
    );

    expect(compile(statement)).toEqual(
      procedureApplicationStatement(lexicalIdentifier("Sum"), [
        lexicalIdentifier("A"),
        lexicalIdentifier("B"),
      ]),
    );
  });
});
