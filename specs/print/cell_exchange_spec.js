import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { cellExchangeStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Printing a cell exchange statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = cellExchangeStatement(
      identifierExpression(lexicalIdentifier("OneVariable")),
      lexicalIdentifier("OtherVariable"),
      identifierExpression(lexicalIdentifier("AnotherVariable")),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual(
      "  {Exchange OneVariable OtherVariable AnotherVariable}",
    );
    expect(result.full).toEqual(
      "  {Exchange OneVariable OtherVariable AnotherVariable}",
    );
  });
});
