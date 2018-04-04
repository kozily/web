import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a raise statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects its used identifier", () => {
    const statement = exceptionRaiseStatement(lexicalIdentifier("X"));

    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["X"]));
  });
});
