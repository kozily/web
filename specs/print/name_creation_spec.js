import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { nameCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a new name statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = nameCreationStatement(lexicalIdentifier("OtherVariable"));
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  {NewName OtherVariable}");
    expect(result.full).toEqual("  {NewName OtherVariable}");
  });
});
