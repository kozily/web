import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import {
  patternMatchingStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalRecord,
  literalTuple,
  literalList,
} from "../../../app/oz/machine/literals";

describe("Collecting free identifiers in a pattern matching statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the appropriate identifiers", () => {
    const statement = patternMatchingStatement(
      operatorExpression(
        "==",
        identifierExpression(lexicalIdentifier("P")),
        identifierExpression(lexicalIdentifier("Q")),
      ),
      literalRecord("person", {
        age: lexicalIdentifier("A"),
        name: lexicalIdentifier("N"),
      }),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Q", "Y", "Z", "N"]),
    );
  });

  it("collects the appropriate identifiers skipping the any as feature in record", () => {
    const statement = patternMatchingStatement(
      identifierExpression(lexicalIdentifier("P")),
      literalRecord("person", {
        age: lexicalIdentifier("A"),
        name: lexicalIdentifier("N"),
        status: lexicalIdentifier("_"),
      }),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Y", "Z", "N"]),
    );
  });

  it("collects the appropriate identifiers skipping the any as identifier", () => {
    const statement = patternMatchingStatement(
      identifierExpression(lexicalIdentifier("P")),
      lexicalIdentifier("_"),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Y", "A", "Z", "N"]),
    );
  });

  it("collects the appropriate identifiers skipping the any as tuple", () => {
    const statement = patternMatchingStatement(
      identifierExpression(lexicalIdentifier("P")),
      literalTuple("#", [
        lexicalIdentifier("_"),
        literalTuple("vector", [
          lexicalIdentifier("A"),
          lexicalIdentifier("_"),
        ]),
      ]),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Y", "Z", "N"]),
    );
  });

  it("collects the appropriate identifiers skipping the any as list", () => {
    const statement = patternMatchingStatement(
      identifierExpression(lexicalIdentifier("P")),
      literalList([lexicalIdentifier("_"), lexicalIdentifier("A")]),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["P", "Y", "Z", "N"]),
    );
  });
});
