import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { portSendStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Collecting free identifiers in a port send statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects both value and port identifiers", () => {
    const statement = portSendStatement(
      identifierExpression(lexicalIdentifier("X")),
      identifierExpression(lexicalIdentifier("Y")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y"]),
    );
  });
});
