import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { bindingStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";

describe("Collecting free identifiers in a binding statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects both lhs and rhs identifiers", () => {
    const statement = bindingStatement(
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["X", "Y"]),
    );
  });
});
