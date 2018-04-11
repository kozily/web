import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { literalRecord } from "../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling record values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const value = literalRecord("person", {
      age: lexicalIdentifier("A"),
      name: lexicalIdentifier("N"),
    });

    expect(compile(value)).toEqual(value);
  });
});
