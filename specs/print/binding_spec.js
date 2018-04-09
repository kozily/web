import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { bindingStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a binding statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = bindingStatement(
      lexicalIdentifier("OneVariable"),
      lexicalIdentifier("OtherVariable"),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  OneVariable = OtherVariable");
    expect(result.full).toEqual("  OneVariable = OtherVariable");
  });
});
