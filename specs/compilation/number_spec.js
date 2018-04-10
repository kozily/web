import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { literalNumber } from "../../app/oz/machine/literals";

describe("Compiling number values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const value = literalNumber(3);

    expect(compile(value)).toEqual(value);
  });
});
