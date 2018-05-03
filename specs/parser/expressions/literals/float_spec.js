import Immutable from "immutable";
import { numberExpression } from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing float literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles floats correctly", () => {
    expect(parse("12.")).toEqual(numberExpression(12.0));
    expect(parse("12.34")).toEqual(numberExpression(12.34));
    expect(parse("~12.34")).toEqual(numberExpression(-12.34));
    expect(parse("12.e1")).toEqual(numberExpression(120));
    expect(parse("1.54045e2")).toEqual(numberExpression(154.045));
    expect(parse("12.e~1")).toEqual(numberExpression(1.2));
    expect(parse("~1.54045e2")).toEqual(numberExpression(-154.045));
    expect(parse("1.54045e~2")).toEqual(numberExpression(0.0154045));
    expect(parse("~1.54045e~2")).toEqual(numberExpression(-0.0154045));
    expect(parse("1.54045E2")).toEqual(numberExpression(154.045));
    expect(parse("~1.54045E2")).toEqual(numberExpression(-154.045));
    expect(parse("1.54045E~2")).toEqual(numberExpression(0.0154045));
    expect(parse("~1.54045E~2")).toEqual(numberExpression(-0.0154045));
  });
});
