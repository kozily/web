import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { valueBuiltIn } from "../../app/oz/machine/values";

describe("Printing a built in value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string when using namespaced builtin values", () => {
    const value = valueBuiltIn("+", "Number");
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("BuiltIn(Number.'+')");
    expect(result.full).toEqual("BuiltIn(Number.'+')");
  });

  it("Returns the appropriate string when using no namespaced builtin values", () => {
    const value = valueBuiltIn("IsDet");
    const result = print(value);

    expect(result.abbreviated).toEqual("BuiltIn(IsDet)");
    expect(result.full).toEqual("BuiltIn(IsDet)");
  });
});
