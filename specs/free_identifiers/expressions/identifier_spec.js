import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Collecting free identifiers in an identifier expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the free identifiers", () => {
    const statement = identifierExpression(lexicalIdentifier("N"));
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["N"]));
  });
});
