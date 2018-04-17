import Immutable from "immutable";
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
      literalRecord("person", {
        age: lexicalIdentifier("A"),
      }),
    );
  });

  it("parses atoms successfully", () => {
    expect(parse("person")).toEqual(literalAtom("person"));
  });

  it("parses booleans successfully", () => {
    expect(parse("true")).toEqual(literalBoolean(true));
  });

  it("parses numbers successfully", () => {
    expect(parse("12")).toEqual(literalNumber(12));
  });

  it("parses procedures successfully", () => {
    expect(parse("proc {$ O} skip end")).toEqual(
      literalProcedure([lexicalIdentifier("O")], skipStatementSyntax()),
    );
  });
});
