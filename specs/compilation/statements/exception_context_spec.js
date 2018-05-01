import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  exceptionContextStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  exceptionContextStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling exception context statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = exceptionContextStatementSyntax(
      skipStatementSyntax(),
      lexicalIdentifier("X"),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      exceptionContextStatement(
        skipStatement(),
        lexicalIdentifier("X"),
        skipStatement(),
      ),
    );
  });
});
