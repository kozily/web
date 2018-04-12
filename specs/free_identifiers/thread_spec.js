import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  threadStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a thread statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all identifiers from substatements", () => {
    const statement = threadStatement(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y"]),
    );
  });
});
