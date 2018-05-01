import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { portCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { portCreationStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling port creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = portCreationStatementSyntax(
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
    );

    expect(compile(statement)).toEqual(
      portCreationStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
  });
});
