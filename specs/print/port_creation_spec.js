import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { portCreationStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a port creation statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = portCreationStatement(
      lexicalIdentifier("OneVariable"),
      lexicalIdentifier("OtherVariable"),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  {NewPort OneVariable OtherVariable}");
    expect(result.full).toEqual("  {NewPort OneVariable OtherVariable}");
  });
});
