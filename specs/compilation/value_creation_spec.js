import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { valueCreationStatementSyntax } from "../../app/oz/machine/statementSyntax";
import { valueCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalNumber } from "../../app/oz/machine/literals";

describe("Compiling value creation statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = valueCreationStatementSyntax(
      lexicalIdentifier("X"),
      literalNumber(3),
    );

    expect(compile(statement)).toEqual(
      valueCreationStatement(lexicalIdentifier("X"), literalNumber(3)),
    );
  });
});
