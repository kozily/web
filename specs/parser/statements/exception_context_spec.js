import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  exceptionContextStatementSyntax,
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing try statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles condensed syntax correctly", () => {
    expect(parse("try skip catch X then skip skip end")).toEqual(
      exceptionContextStatementSyntax(
        skipStatementSyntax(),
        lexicalIdentifier("X"),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
      ),
    );
  });

  it("handles spaced syntax correctly", () => {
    expect(parse("try\n\tskip\ncatch X then\n\tskip\n\tskip\nend")).toEqual(
      exceptionContextStatementSyntax(
        skipStatementSyntax(),
        lexicalIdentifier("X"),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
      ),
    );
  });
});
