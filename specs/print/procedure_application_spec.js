import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { procedureApplicationStatement } from "../../app/oz/machine/statements";
import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a procedure application statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = procedureApplicationStatement(
      identifierExpression(lexicalIdentifier("Sum")),
      [
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("B")),
        identifierExpression(lexicalIdentifier("C")),
      ],
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  {Sum A B C}");
    expect(result.full).toEqual("  {Sum A B C}");
  });
});
