import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import {
  conditionalStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../app/oz/machine/statementSyntax";
import {
  conditionalStatement,
  skipStatement,
  bindingStatement,
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

  it("compiles appropriately conditionals without else", () => {
    const statement = conditionalStatementSyntax(
      lexicalIdentifier("X"),
      bindingStatementSyntax(lexicalIdentifier("A"), lexicalIdentifier("B")),
    );

    expect(compile(statement)).toEqual(
      conditionalStatement(
        lexicalIdentifier("X"),
        bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
        skipStatement(),
      ),
    );
  });
});
