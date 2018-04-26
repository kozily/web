import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { valueMutableVariable } from "../../app/oz/machine/values";

describe("Printing a mutable reference value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string when using inline values", () => {
    const value = valueMutableVariable("cell", 0);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("MutableRef(cell0)");
    expect(result.full).toEqual("MutableRef(cell0)");
  });
});
