import Immutable from "immutable";
import {
  identifierExpression,
  functionExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

const identifier = id => identifierExpression(lexicalIdentifier(id));

describe("Parsing function expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("without arguments", () => {
    it("parses condensed syntax correctly", () => {
      expect(parse("{Sum}")).toEqual(functionExpression(identifier("Sum")));
    });

    it("parses weird spaced syntax correctly", () => {
      expect(parse("{\t  \nSum   }")).toEqual(
        functionExpression(identifier("Sum")),
      );
    });
  });

  describe("with arguments", () => {
    it("parses condensed syntax correctly", () => {
      expect(parse("{Sum A B}")).toEqual(
        functionExpression(identifier("Sum"), [
          identifier("A"),
          identifier("B"),
        ]),
      );
    });

    it("parses weird spaced syntax correctly", () => {
      expect(parse("{\t  \nSum   A\r\nB   }")).toEqual(
        functionExpression(identifier("Sum"), [
          identifier("A"),
          identifier("B"),
        ]),
      );
    });
  });
});
