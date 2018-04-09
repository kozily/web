import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { localStatement, skipStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a local statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = localStatement(
      lexicalIdentifier("Variable"),
      skipStatement(),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  local Variable in ... end");
    expect(result.full).toEqual("  local Variable in\n    skip\n  end");
  });
});
