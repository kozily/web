import Immutable from "immutable";
import { lexicalIdentifier } from "../../samples/lexical";
import { valueRecord } from "../../samples/values";
import {
  patternMatchingStatement,
  sequenceStatement,
  skipStatement,
} from "../../samples/statements";
import parse from "../../../app/oz/parser";

describe("Parsing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles record with label and features", () => {
    expect(
      parse("case X of person(name:Name age:Age) then skip skip else skip end"),
    ).toEqual(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        valueRecord("person", {
          name: lexicalIdentifier("Name"),
          age: lexicalIdentifier("Age"),
        }),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
    );
  });

  it("handles record with label and no features", () => {
    expect(parse("case X of person then skip skip else skip end")).toEqual(
      patternMatchingStatement(
        lexicalIdentifier("X"),
        valueRecord("person"),
        sequenceStatement(skipStatement(), skipStatement()),
        skipStatement(),
      ),
    );
  });
});
