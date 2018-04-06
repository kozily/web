import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  sequenceStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a sequence statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all identifiers from all substatements", () => {
    const statement = sequenceStatement(
      bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["A", "B", "X", "Y"]),
    );
  });
});
