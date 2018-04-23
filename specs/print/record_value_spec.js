import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  valueRecord,
  valueAtom,
  valueBoolean,
  valueTuple,
  valueList,
} from "../../app/oz/machine/values";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a record value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string for standard records", () => {
    const value = valueRecord("person", {
      name: lexicalIdentifier("N"),
      age: lexicalIdentifier("Age"),
    });
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("person(age:Age name:N)");
    expect(result.full).toEqual("person(age:Age name:N)");
  });

  it("Returns the appropriate string for atoms", () => {
    const value = valueAtom("person");
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("person");
    expect(result.full).toEqual("person");
  });

  it("Returns the appropriate string for booleans", () => {
    const value = valueBoolean(true);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("true");
    expect(result.full).toEqual("true");
  });

  it("Returns the appropriate string for generic tuples", () => {
    const value = valueTuple("person", [
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
      lexicalIdentifier("Z"),
    ]);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("person(X Y Z)");
    expect(result.full).toEqual("person(X Y Z)");
  });

  it("Returns the appropriate string for generic lists", () => {
    const value = valueList([
      lexicalIdentifier("X"),
      lexicalIdentifier("Y"),
      lexicalIdentifier("Z"),
    ]);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("[X Y Z]");
    expect(result.full).toEqual("[X Y Z]");
  });
});
