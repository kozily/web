import Immutable from "immutable";
import {
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalFunction,
  literalNumber,
} from "../../../app/oz/machine/literals";
import parse from "../../../app/oz/parser";

describe("Parsing function declaration statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly with args and statements", () => {
    expect(parse("fun {FunctionName Arg1 Arg2} skip 5 end")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("FunctionName")),
        literalExpression(
          literalFunction(
            [lexicalIdentifier("Arg1"), lexicalIdentifier("Arg2")],
            literalExpression(literalNumber(5)),
            skipStatementSyntax(),
          ),
        ),
      ),
    );
  });

  it("handles it correctly with args and no statements", () => {
    expect(parse("fun {FunctionName Arg1 Arg2} 5 end")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("FunctionName")),
        literalExpression(
          literalFunction(
            [lexicalIdentifier("Arg1"), lexicalIdentifier("Arg2")],
            literalExpression(literalNumber(5)),
          ),
        ),
      ),
    );
  });

  it("handles it correctly without args", () => {
    expect(parse("fun {FunctionName} 5 end")).toEqual(
      bindingStatementSyntax(
        identifierExpression(lexicalIdentifier("FunctionName")),
        literalExpression(
          literalFunction([], literalExpression(literalNumber(5))),
        ),
      ),
    );
  });
});
