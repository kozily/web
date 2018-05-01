import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  localStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  localStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling local statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = localStatementSyntax(
      [lexicalIdentifier("X")],
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      localStatement(lexicalIdentifier("X"), skipStatement()),
    );
  });

  it("compiles appropriately when using multiple identifierrs", () => {
    const statement = localStatementSyntax(
      [
        lexicalIdentifier("X"),
        lexicalIdentifier("Y"),
        lexicalIdentifier("Variable"),
      ],
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      localStatement(
        lexicalIdentifier("X"),
        localStatement(
          lexicalIdentifier("Y"),
          localStatement(lexicalIdentifier("Variable"), skipStatement()),
        ),
      ),
    );
  });
});
