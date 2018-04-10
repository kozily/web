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

  describe("when condition is a variable", () => {
    it("when is composed by two statement in the true statement", () => {
      expect(parse("if X then skip skip else skip end")).toEqual(
        conditionalStatementSyntax(
          lexicalIdentifier("X"),
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
          skipStatementSyntax(),
        ),
      );
    });

    it("when is composed by two statements in the false statement", () => {
      expect(parse("if X then skip else skip skip end")).toEqual(
        conditionalStatementSyntax(
          lexicalIdentifier("X"),
          skipStatementSyntax(),
          sequenceStatementSyntax(skipStatementSyntax(), skipStatementSyntax()),
        ),
      );
    });
  });
});
