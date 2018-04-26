import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  literalRecord,
  literalAtom,
  literalBoolean,
  literalTuple,
  literalList,
  literalNumber,
} from "../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a record literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string for standard records", () => {
    const literal = literalRecord("person", {
      name: lexicalIdentifier("N"),
      age: literalNumber(30),
    });
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("person(age:30 name:N)");
    expect(result.full).toEqual("person(age:30 name:N)");
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
      literalNumber(30),
    ]);
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("person(X 30)");
    expect(result.full).toEqual("person(X 30)");
  });

  it("Returns the appropriate string for lists", () => {
    const literal = literalList([lexicalIdentifier("X"), literalNumber(30)]);
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("[X 30]");
    expect(result.full).toEqual("[X 30]");
  });

  it("Returns the appropriate string for nested recursive structures", () => {
    const literal = literalRecord("person", {
      age: literalNumber(30),
      address: literalRecord("address", {
        number: literalNumber(1300),
      }),
    });
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual(
      "person(address:address(number:1300) age:30)",
    );
    expect(result.full).toEqual("person(address:address(number:1300) age:30)");
  });
});
