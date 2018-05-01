import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { nameCreationStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { nameCreationStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling name creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = nameCreationStatementSyntax(lexicalIdentifier("Y"));

    expect(compile(statement)).toEqual(
      nameCreationStatement(lexicalIdentifier("Y")),
    );
  });
});
