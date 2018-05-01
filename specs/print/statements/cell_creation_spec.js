import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { cellCreationStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Printing a cell creation statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = cellCreationStatement(
      identifierExpression(lexicalIdentifier("OneVariable")),
      lexicalIdentifier("OtherVariable"),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  {NewCell OneVariable OtherVariable}");
    expect(result.full).toEqual("  {NewCell OneVariable OtherVariable}");
  });
});
