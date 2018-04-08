import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  sequenceStatement,
  skipStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a sequence statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = sequenceStatement(
      skipStatement(),
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  skip ... (sequence)");
    expect(result.full).toEqual("  skip\n  X = Y");
  });
});
