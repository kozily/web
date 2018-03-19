import Immutable from "immutable";
import { valueNumber } from "../../samples/values";
import { parserFor } from "../../../app/oz/parser";
import valueGrammar from "../../../app/oz/grammar/values.ne";

const parse = parserFor(valueGrammar);

describe("Parsing float values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles floats correctly", () => {
    expect(parse("12.")).toEqual(valueNumber(12.0));
    expect(parse("12.34")).toEqual(valueNumber(12.34));
    expect(parse("~12.34")).toEqual(valueNumber(-12.34));
    expect(parse("12.e1")).toEqual(valueNumber(120));
    expect(parse("1.54045e2")).toEqual(valueNumber(154.045));
    expect(parse("12.e~1")).toEqual(valueNumber(1.2));
    expect(parse("~1.54045e2")).toEqual(valueNumber(-154.045));
    expect(parse("1.54045e~2")).toEqual(valueNumber(0.0154045));
    expect(parse("~1.54045e~2")).toEqual(valueNumber(-0.0154045));
    expect(parse("1.54045E2")).toEqual(valueNumber(154.045));
    expect(parse("~1.54045E2")).toEqual(valueNumber(-154.045));
    expect(parse("1.54045E~2")).toEqual(valueNumber(0.0154045));
    expect(parse("~1.54045E~2")).toEqual(valueNumber(-0.0154045));
  });
});
