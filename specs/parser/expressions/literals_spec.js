import Immutable from "immutable";
import { literalExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalRecord,
  literalAtom,
  literalBoolean,
  literalNumber,
  literalProcedure,
} from "../../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax.js";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";

const parse = parserFor(expressionsGrammar);

describe("Parsing literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses records successfully", () => {
    expect(parse("person(age:A)")).toEqual(
      literalExpression(
        literalRecord("person", {
          age: lexicalIdentifier("A"),
        }),
      ),
    );
  });

  it("parses atoms successfully", () => {
    expect(parse("person")).toEqual(literalExpression(literalAtom("person")));
  });

  it("parses booleans successfully", () => {
    expect(parse("true")).toEqual(literalExpression(literalBoolean(true)));
  });

  it("parses numbers successfully", () => {
    expect(parse("12")).toEqual(literalExpression(literalNumber(12)));
  });

  it("parses procedures successfully", () => {
    expect(parse("proc {$ O} skip end")).toEqual(
      literalExpression(
        literalProcedure([lexicalIdentifier("O")], skipStatementSyntax()),
      ),
    );
  });
});
