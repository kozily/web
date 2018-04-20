import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing an identifier expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = identifierExpression(lexicalIdentifier("A"));
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("A");
    expect(result.full).toEqual("A");
  });
});
