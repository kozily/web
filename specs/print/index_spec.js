import Immutable from "immutable";
import { printers } from "../../app/oz/print";
import { allStatementTypes } from "../../app/oz/machine/statements";
import { allValueTypes } from "../../app/oz/machine/values";

describe("Printing", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a printer for all types", () => {
    const typesWithPrinters = Immutable.Set(Object.keys(printers.statement));
    const types = Immutable.Set(allStatementTypes);

    expect(typesWithPrinters).toEqual(types);
  });

  it("has a printer for all literals", () => {
    const literalsWithPrinters = Immutable.Set(Object.keys(printers.literal));
    const literals = Immutable.Set(allValueTypes);

    expect(literalsWithPrinters).toEqual(literals);
  });
});
