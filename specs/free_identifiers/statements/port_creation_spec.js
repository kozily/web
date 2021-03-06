import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { portCreationStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Collecting free identifiers in a port creation statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects both value and port identifiers", () => {
    const statement = portCreationStatement(
      lexicalIdentifier("X"),
      identifierExpression(lexicalIdentifier("Y")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y"]),
    );
  });
});
