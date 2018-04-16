import Immutable from "immutable";
import { collectors } from "../../app/oz/free_identifiers";
import { allStatementTypes } from "../../app/oz/machine/statements";
import { allLiteralTypes } from "../../app/oz/machine/literals";

describe("Collecting free identifiers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a collector for all types", () => {
    const typesWithCollectors = Immutable.Set(
      Object.keys(collectors.statement),
    );
    const types = Immutable.Set(allStatementTypes);

    expect(typesWithCollectors).toEqual(types);
  });

  it("has a collector for all literals", () => {
    const literalsWithCollectors = Immutable.Set(
      Object.keys(collectors.literal),
    );
    const types = Immutable.Set(allLiteralTypes);

    expect(literalsWithCollectors).toEqual(types);
  });
});
