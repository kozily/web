import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { literalProcedure } from "../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling procedure values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const value = literalProcedure(
      [lexicalIdentifier("A", lexicalIdentifier("B"))],
      skipStatementSyntax(),
    );

    expect(compile(value)).toEqual(
      literalProcedure(
        [lexicalIdentifier("A", lexicalIdentifier("B"))],
        skipStatement(),
      ),
    );
  });
});
