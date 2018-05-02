import Immutable from "immutable";
import {
  identifierExpression,
  atCellExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing at cell expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses at cell successfully", () => {
    expect(parse("@OneVariable")).toEqual(
      atCellExpression(identifierExpression(lexicalIdentifier("OneVariable"))),
    );
  });

  it("parses at cell successfully", () => {
    expect(parse("@C")).toEqual(
      atCellExpression(identifierExpression(lexicalIdentifier("C"))),
    );
  });
});
