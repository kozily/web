import Immutable from "immutable";
import {
  skipStatementSyntax,
  bindingStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { literalProcedure } from "../../../app/oz/machine/literals";
import parse from "../../../app/oz/parser";

describe("Parsing procedure declaration statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly with args", () => {
    expect(parse("proc {ProcedureName Arg1 Arg2} skip skip end")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("ProcedureName")),
        literalExpression(
          literalProcedure(
            [lexicalIdentifier("Arg1"), lexicalIdentifier("Arg2")],
            sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          ),
        ),
      ),
    );
  });

  it("handles it correctly without args", () => {
    expect(parse("proc {ProcedureName} skip skip end")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("ProcedureName")),
        literalExpression(
          literalProcedure(
            [],
            sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          ),
        ),
      ),
    );
  });
});
