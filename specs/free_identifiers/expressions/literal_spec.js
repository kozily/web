import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import { literalExpression } from "../../../app/oz/machine/expressions";
import { literalRecord } from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Collecting free identifiers in a literal expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the free identifiers of the literal", () => {
    const statement = literalExpression(
      literalRecord("person", {
        name: lexicalIdentifier("N"),
      }),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["N"]));
  });
});
