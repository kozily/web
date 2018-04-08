import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { skipStatement } from "../../app/oz/machine/statements";

describe("Printing a skip statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = skipStatement();
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  skip");
    expect(result.full).toEqual("  skip");
  });
});
