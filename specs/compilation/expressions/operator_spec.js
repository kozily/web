import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  operatorExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";

describe("Compiling operator expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const expression = operatorExpression(
      "+",
      literalExpression(literalNumber(3)),
      literalExpression(literalNumber(4)),
    );

    expect(compile(expression)).toEqual(expression);
  });
});
