import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Printing an identifier expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string with simple identifiers", () => {
    const expression = identifierExpression(lexicalIdentifier("A"));
    const result = print(expression, 2);

    expect(result.abbreviated).toEqual("A");
    expect(result.full).toEqual("A");
  });

  it("returns the appropriate string with identifiers with strange symbols", () => {
    const expression = identifierExpression(lexicalIdentifier("@system"));
    const result = print(expression, 2);

    expect(result.abbreviated).toEqual("`@system`");
    expect(result.full).toEqual("`@system`");
  });

  it("returns the appropriate string with the any identifier", () => {
    const expression = identifierExpression(lexicalIdentifier("_"));
    const result = print(expression, 2);

    expect(result.abbreviated).toEqual("_");
    expect(result.full).toEqual("_");
  });
});
