import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { procedureApplicationStatement } from "../../app/oz/machine/statements";
import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a procedure application statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the procedure identifier and any arguments", () => {
    const statement = procedureApplicationStatement(
      identifierExpression(lexicalIdentifier("P")),
      [
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ],
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "X", "Y"]),
    );
  });
});
