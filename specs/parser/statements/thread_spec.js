import Immutable from "immutable";
import {
  threadStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing thread statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("thread skip end")).toEqual(
      threadStatementSyntax(skipStatementSyntax()),
    );
  });
});
