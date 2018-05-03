import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import { nameCreationExpression } from "../../../app/oz/machine/expressions";

const parse = parserFor(expressionsGrammar);

describe("Parsing name creation statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses", () => {
    expect(parse("{NewName}")).toEqual(nameCreationExpression());
  });
});
