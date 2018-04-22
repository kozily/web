import Immutable from "immutable";

import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
  conditionalStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing conditional statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses simple if ... then ... else ... end statements", () => {
    expect(parse("if X then skip skip else skip end")).toEqual(
      conditionalStatementSyntax(
        lexicalIdentifier("X"),
        sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        skipStatementSyntax(),
      ),
    );
  });

  it("parses simple if ... then ... end statements", () => {
    expect(parse("if X then skip end")).toEqual(
      conditionalStatementSyntax(lexicalIdentifier("X"), skipStatementSyntax()),
    );
  });
});
