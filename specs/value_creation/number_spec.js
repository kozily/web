import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/store";
import { buildEnvironment } from "../../app/oz/machine/build";
import { literalNumber } from "../samples/literals";
import { valueNumber } from "../samples/values";

describe("Creating number values in the store", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a store number value", () => {
    const environment = buildEnvironment();
    const literal = literalNumber(155);

    expect(createValue(environment, literal)).toEqual(valueNumber(155));
  });
});
