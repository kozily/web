import Immutable from "immutable";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles a single space between statements correctly", () => {
    expect(parse("skip skip")).toEqual(
      sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
    );
  });

  it("handles multiple whitespace characters correctly", () => {
    expect(parse("skip\n\t  skip")).toEqual(
      sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
    );
  });

  it("handles multiple nested sequences correctly", () => {
    expect(parse("skip skip skip")).toEqual(
      sequenceStatementSyntax(
        skipStatementSyntax(),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
      ),
    );
  });
});
