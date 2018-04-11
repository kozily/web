import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import {
  conditionalStatementSyntax,
  skipStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  conditionalStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = conditionalStatementSyntax(
      lexicalIdentifier("X"),
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(
        lexicalIdentifier("X"),
        skipStatement(),
        skipStatement(),
      ),
    );
  });
});
