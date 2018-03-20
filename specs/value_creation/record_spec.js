import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/store";
import { buildEnvironment, buildVariable } from "../../app/oz/machine/build";
import { literalRecord } from "../samples/literals";
import { valueRecord } from "../samples/values";
import { lexicalIdentifier } from "../samples/lexical";

describe("Creating record values in the store", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a store record value", () => {
    const environment = buildEnvironment({
      X: buildVariable("x", 0),
      Y: buildVariable("y", 0),
    });

    const literal = literalRecord("person", {
      age: lexicalIdentifier("X"),
      name: lexicalIdentifier("Y"),
    });

    expect(createValue(environment, literal)).toEqual(
      valueRecord("person", {
        age: buildVariable("x", 0),
        name: buildVariable("y", 0),
      }),
    );
  });
});
