import Immutable from "immutable";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing colon equals cell expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses colon equals cell successfully", () => {
    expect(parse("C := X")).toEqual(
      operatorExpression(
        ":=",
        identifierExpression(lexicalIdentifier("C")),
        identifierExpression(lexicalIdentifier("X")),
      ),
    );
  });
});
