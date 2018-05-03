import Immutable from "immutable";
import {
  tupleExpression,
  numberExpression,
  identifierExpression,
} from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing tuple literals", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(X Y)")).toEqual(
      tupleExpression("label", [
        identifierExpression("X"),
        identifierExpression("Y"),
      ]),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(X)")).toEqual(
      tupleExpression("label", [identifierExpression("X")]),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(Feature)")).toEqual(
      tupleExpression("label", [identifierExpression("Feature")]),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  X\n  Y\n)")).toEqual(
      tupleExpression("label", [
        identifierExpression("X"),
        identifierExpression("Y"),
      ]),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  X\n  \n)")).toEqual(
      tupleExpression("label", [identifierExpression("X")]),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(X Y)")).toEqual(
      tupleExpression("andthen", [
        identifierExpression("X"),
        identifierExpression("Y"),
      ]),
    );
  });

  it("handles nested literals", () => {
    expect(parse("label(30 50 Z)")).toEqual(
      tupleExpression("label", [
        numberExpression(30),
        numberExpression(50),
        identifierExpression("Z"),
      ]),
    );
  });

  it("handles hashed literals", () => {
    expect(parse("H#T")).toEqual(
      tupleExpression("#", [
        identifierExpression("H"),
        identifierExpression("T"),
      ]),
    );
  });

  it("handles repeated hashed literals", () => {
    expect(parse("1#2#T")).toEqual(
      tupleExpression("#", [
        numberExpression(1),
        numberExpression(2),
        identifierExpression("T"),
      ]),
    );
  });
});
