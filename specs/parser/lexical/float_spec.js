import Immutable from "immutable";
import { lexicalNumber } from "../../samples/lexical";
import { parserFor } from "../../../app/oz/parser";
import lexicalGrammar from "../../../app/oz/grammar/lexical.nearley";

const parse = parserFor(lexicalGrammar);

describe("Parsing lexical float elements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles floats correctly", () => {
    expect(parse("12.")).toEqual(lexicalNumber(12.0));
    expect(parse("12.34")).toEqual(lexicalNumber(12.34));
    expect(parse("~12.34")).toEqual(lexicalNumber(-12.34));
    expect(parse("12.e1")).toEqual(lexicalNumber(120));
    expect(parse("1.54045e2")).toEqual(lexicalNumber(154.045));
    expect(parse("12.e~1")).toEqual(lexicalNumber(1.2));
    expect(parse("~1.54045e2")).toEqual(lexicalNumber(-154.045));
    expect(parse("1.54045e~2")).toEqual(lexicalNumber(0.0154045));
    expect(parse("~1.54045e~2")).toEqual(lexicalNumber(-0.0154045));
    expect(parse("1.54045E2")).toEqual(lexicalNumber(154.045));
    expect(parse("~1.54045E2")).toEqual(lexicalNumber(-154.045));
    expect(parse("1.54045E~2")).toEqual(lexicalNumber(0.0154045));
    expect(parse("~1.54045E~2")).toEqual(lexicalNumber(-0.0154045));
  });
});
