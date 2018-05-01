import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { literalExpression } from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";

describe("Printing a literal expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = literalExpression(literalNumber(3));
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("3");
    expect(result.full).toEqual("3");
  });
});
