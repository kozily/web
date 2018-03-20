import Immutable from "immutable";
import { literalNumber } from "../../samples/literals";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/literals.ne";

const parse = parserFor(valueGrammar);

describe("Parsing float values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles floats correctly", () => {
    expect(parse("12.")).toEqual(literalNumber(12.0));
    expect(parse("12.34")).toEqual(literalNumber(12.34));
    expect(parse("~12.34")).toEqual(literalNumber(-12.34));
    expect(parse("12.e1")).toEqual(literalNumber(120));
    expect(parse("1.54045e2")).toEqual(literalNumber(154.045));
    expect(parse("12.e~1")).toEqual(literalNumber(1.2));
    expect(parse("~1.54045e2")).toEqual(literalNumber(-154.045));
    expect(parse("1.54045e~2")).toEqual(literalNumber(0.0154045));
    expect(parse("~1.54045e~2")).toEqual(literalNumber(-0.0154045));
    expect(parse("1.54045E2")).toEqual(literalNumber(154.045));
    expect(parse("~1.54045E2")).toEqual(literalNumber(-154.045));
    expect(parse("1.54045E~2")).toEqual(literalNumber(0.0154045));
    expect(parse("~1.54045E~2")).toEqual(literalNumber(-0.0154045));
  });
});
