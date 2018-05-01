import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { literalNumber } from "../../../app/oz/machine/literals";

describe("Printing a number literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const literal = literalNumber(150);
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("150");
    expect(result.full).toEqual("150");
  });
});
