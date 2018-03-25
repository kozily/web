import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { skipStatement } from "../samples/statements";

describe("Collecting free identifiers in a skip statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects no identifiers", () => {
    const statement = skipStatement();
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set());
  });
});
