import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import {
  valueRecord,
  valueAtom,
  valueBoolean,
  valueTuple,
  valueList,
  valueListItem,
  valueNumber,
} from "../../../app/oz/machine/values";
import { buildVariable } from "../../../app/oz/machine/build";

describe("Printing a record value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string for standard records", () => {
    const value = valueRecord("person", {
      name: buildVariable("n", 0),
      age: valueNumber(30),
    });
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("person(age:30 name:n0)");
    expect(result.full).toEqual("person(age:30 name:n0)");
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
      buildVariable("x", 0),
      valueNumber(30),
    ]);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("person(x0 30)");
    expect(result.full).toEqual("person(1:x0 2:30)");
  });

  it("Returns the appropriate string for cons tuples", () => {
    const value = valueTuple("#", [
      buildVariable("x", 0),
      valueNumber(30),
      valueNumber(35),
    ]);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("x0#30#35");
    expect(result.full).toEqual("'#'(1:x0 2:30 3:35)");
  });

  it("Returns the appropriate string for lists", () => {
    const value = valueList([buildVariable("x", 0), valueNumber(30)]);
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("[x0 30]");
    expect(result.full).toEqual("'|'(1:x0 2:'|'(1:30 2:nil))");
  });

  it("Returns the appropriate string for list conses", () => {
    const value = valueListItem(valueNumber(30), buildVariable("x", 0));
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("30|x0");
    expect(result.full).toEqual("'|'(1:30 2:x0)");
  });

  it("Returns the appropriate string for nested recursive structures", () => {
    const value = valueRecord("person", {
      age: valueNumber(30),
      address: valueRecord("address", {
        number: valueNumber(1300),
      }),
    });
    const result = print(value, 2);

    expect(result.abbreviated).toEqual(
      "person(address:address(number:1300) age:30)",
    );
    expect(result.full).toEqual("person(address:address(number:1300) age:30)");
  });
});
