import Immutable from "immutable";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("skip")).toEqual(skipStatementSyntax());
  });
});
