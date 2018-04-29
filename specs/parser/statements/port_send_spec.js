import Immutable from "immutable";
import { portSendStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import parse from "../../../app/oz/parser";

describe("Parsing port send statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles it correctly", () => {
    expect(parse("{Send X Y}")).toEqual(
      portSendStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
    );
  });
});
