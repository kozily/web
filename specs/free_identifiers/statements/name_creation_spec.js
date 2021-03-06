import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { nameCreationStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Collecting free identifiers in a new name statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects identifiers", () => {
    const statement = nameCreationStatement(
      identifierExpression(lexicalIdentifier("Y")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["Y"]));
  });
});
