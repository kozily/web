import Immutable from "immutable";
import {
  recordExpression,
  numberExpression,
  identifierExpression,
} from "./helpers";
import { operatorExpression } from "../../../../app/oz/machine/expressions";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing record literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles the standard syntax", () => {
    expect(parse("label(a:X b:Y)")).toEqual(
      recordExpression("label", {
        a: identifierExpression("X"),
        b: identifierExpression("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature", () => {
    expect(parse("label(a:X)")).toEqual(
      recordExpression("label", {
        a: identifierExpression("X"),
      }),
    );
  });

  it("handles the standard syntax with a single multicharacter feature", () => {
    expect(parse("label(feature:X)")).toEqual(
      recordExpression("label", {
        feature: identifierExpression("X"),
      }),
    );
  });

  it("handles the standard syntax with whitespaces", () => {
    expect(parse("label(\n  a:X\n  b:Y\n)")).toEqual(
      recordExpression("label", {
        a: identifierExpression("X"),
        b: identifierExpression("Y"),
      }),
    );
  });

  it("handles the standard syntax with a single feature and whitespaces", () => {
    expect(parse("label(  a:X\n  \n)")).toEqual(
      recordExpression("label", {
        a: identifierExpression("X"),
      }),
    );
  });

  it("handles a quoted label syntax", () => {
    expect(parse("'andthen'(a:X b:Y)")).toEqual(
      recordExpression("andthen", {
        a: identifierExpression("X"),
        b: identifierExpression("Y"),
      }),
    );
  });

  it("handles nested literals", () => {
    expect(parse("label(age:30 name:N address:address(number:1200))")).toEqual(
      recordExpression("label", {
        age: numberExpression(30),
        name: identifierExpression("N"),
        address: recordExpression("address", {
          number: numberExpression(1200),
        }),
      }),
    );
  });

  it("handles literals with expressions", () => {
    expect(parse("label(age:30+3 address:address(number:600*2))")).toEqual(
      recordExpression("label", {
        age: operatorExpression("+", numberExpression(30), numberExpression(3)),
        address: recordExpression("address", {
          number: operatorExpression(
            "*",
            numberExpression(600),
            numberExpression(2),
          ),
        }),
      }),
    );
  });

  it("handles literals with identifiers having multiple letters", () => {
    expect(parse("person(age:Age)")).toEqual(
      recordExpression("person", {
        age: identifierExpression("Age"),
      }),
    );
  });
});
