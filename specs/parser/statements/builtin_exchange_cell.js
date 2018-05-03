import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { bindingStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing cell colon equal statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles built in exchange cell syntax correctly", () => {
    expect(parse("X = C := Y")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        operatorExpression(
          ":=",
          identifierExpression(lexicalIdentifier("C")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
      ),
    );
  });
});
