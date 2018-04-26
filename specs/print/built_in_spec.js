import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { valueBuiltIn } from "../../app/oz/machine/values";

describe("Printing a built in value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string when using inline values", () => {
    const value = valueBuiltIn("+", "Number");
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("BuiltIn(Number.'+')");
    expect(result.full).toEqual("BuiltIn(Number.'+')");
  });
});
