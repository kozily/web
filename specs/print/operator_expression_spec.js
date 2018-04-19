import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  operatorExpression,
  identifierExpression,
} from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing an operator expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = operatorExpression(
      "*",
      identifierExpression(lexicalIdentifier("A")),
      operatorExpression(
        "+",
        identifierExpression(lexicalIdentifier("B")),
        identifierExpression(lexicalIdentifier("C")),
      ),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("A * (B + C)");
    expect(result.full).toEqual("A * (B + C)");
  });
});
