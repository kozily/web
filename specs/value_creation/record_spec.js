import Immutable from "immutable";
import { createValue } from "../../app/oz/machine/sigma";
import { buildEnvironment, buildVariable } from "../../app/oz/machine/build";
import { literalRecord } from "../samples/literals";
import { valueRecord } from "../samples/values";
import { lexicalIdentifier } from "../samples/lexical";

describe("Creating record values in the sigma", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("creates a sigma record value", () => {
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
