import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a raise statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = exceptionRaiseStatement(lexicalIdentifier("X"));
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  raise X end");
    expect(result.full).toEqual("  raise X end");
  });
});
