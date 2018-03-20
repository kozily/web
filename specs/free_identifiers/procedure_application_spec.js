import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { procedureApplicationStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";

describe("Collecting free identifiers in a procedure application statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the procedure identifier and any arguments", () => {
    const statement = procedureApplicationStatement(lexicalIdentifier("P"), [
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
    ]);
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "X", "Y"]),
    );
  });
});
