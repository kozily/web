import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/sigma";
import { buildEnvironment } from "../../app/oz/machine/build";
import { literalNumber } from "../../app/oz/machine/literals";
import { valueNumber } from "../../app/oz/machine/values";

describe("Creating number values in the sigma", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a sigma number value", () => {
    const environment = buildEnvironment();
    const literal = literalNumber(155);

    expect(createValue(environment, literal)).toEqual(valueNumber(155));
  });
});
