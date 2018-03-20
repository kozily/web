import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { localStatement, bindingStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";

describe("Collecting free identifiers in a local statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all identifiers from the substatement except the local identifiers", () => {
    const statement = localStatement(
      lexicalIdentifier("A"),
      bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["B"]));
  });
});
