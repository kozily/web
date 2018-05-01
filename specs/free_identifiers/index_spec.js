import Immutable from "immutable";
import { collectors } from "../../app/oz/free_identifiers";
import { allStatementTypes } from "../../app/oz/machine/statements";
import { kernelLiteralTypes } from "../../app/oz/machine/literals";
import { kernelExpressionTypes } from "../../app/oz/machine/expressions";

const allLiteralTypes = Object.keys(kernelLiteralTypes);
const allExpressionTypes = Object.keys(kernelExpressionTypes);

describe("Collecting free identifiers", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a collector for all types", () => {
    const typesWithCollectors = Immutable.Set(
      Object.keys(collectors.statement),
    );
    const types = Immutable.Set(allStatementTypes);

    expect(typesWithCollectors).toEqual(types);
  });

  it("has a collector for all literals", () => {
    const literalsWithCollectors = Immutable.Set(
      Object.keys(collectors.literal),
    );
    const types = Immutable.Set(allLiteralTypes);

    expect(literalsWithCollectors).toEqual(types);
  });

  it("has a collector for all expressions", () => {
    const expressionsWithCollectors = Immutable.Set(
      Object.keys(collectors.expression),
    );
    const types = Immutable.Set(allExpressionTypes);

    expect(expressionsWithCollectors).toEqual(types);
  });
});
