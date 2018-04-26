import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  literalRecord,
  literalAtom,
  literalBoolean,
  literalTuple,
} from "../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a record literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string for standard records", () => {
    const literal = literalRecord("person", {
      name: lexicalIdentifier("N"),
      age: lexicalIdentifier("Age"),
    });
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("person(age:Age name:N)");
    expect(result.full).toEqual("person(age:Age name:N)");
  });

  it("Returns the appropriate string for atoms", () => {
    const literal = literalAtom("person");
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("person");
    expect(result.full).toEqual("person");
  });

  it("Returns the appropriate string for booleans", () => {
    const literal = literalBoolean(true);
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("true");
    expect(result.full).toEqual("true");
  });

  it("Returns the appropriate string for generic tuples", () => {
    const literal = literalTuple("person", [
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
      lexicalIdentifier("Z"),
    ]);
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("person(X Y Z)");
    expect(result.full).toEqual("person(X Y Z)");
  });
});
