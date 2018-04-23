import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { valueNumber } from "../../app/oz/machine/values";

describe("Printing a number value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const value = valueNumber(150);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("150");
    expect(result.full).toEqual("150");
  });
});
