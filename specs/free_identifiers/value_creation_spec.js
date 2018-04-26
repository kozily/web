import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { valueCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalExpression } from "../../app/oz/machine/expressions";
import { literalRecord } from "../../app/oz/machine/literals";

describe("Collecting free identifiers in a value creation statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the lhs identifier and all the identifiers in the literal", () => {
    const statement = valueCreationStatement(
      lexicalIdentifier("X"),
      literalExpression(
        literalRecord("person", {
          age: lexicalIdentifier("A"),
          name: lexicalIdentifier("N"),
        }),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "A", "N"]),
    );
  });
});
