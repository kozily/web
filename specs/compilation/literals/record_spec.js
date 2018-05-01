import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  literalRecord,
  literalProcedure,
  literalNumber,
} from "../../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling record values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const value = literalRecord("person", {
      age: lexicalIdentifier("A"),
      name: lexicalIdentifier("N"),
    });

    expect(compile(value)).toEqual(value);
  });

  it("compiles nested records appropriately", () => {
    const value = literalRecord("person", {
      operation: literalProcedure(
        [lexicalIdentifier("A")],
        skipStatementSyntax(),
      ),
      number: literalNumber(30),
    });

    expect(compile(value)).toEqual(
      literalRecord("person", {
        operation: literalProcedure([lexicalIdentifier("A")], skipStatement()),
        number: literalNumber(30),
      }),
    );
  });
});
