import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { literalNumber } from "../../../app/oz/machine/literals";
import { skipStatement } from "../../../app/oz/machine/statements";

describe("Compiling number values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const literal = literalNumber(3);

    const compilation = compile(literal);

    expect(compilation.resultingExpression).toEqual(literal);

    const resultingStatement = compilation.augmentStatement(skipStatement());
    expect(resultingStatement).toEqual(skipStatement());
  });
});
