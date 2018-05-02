import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import {
  patternMatchingExpression,
  literalExpression,
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  literalRecord,
  literalAtom,
  literalNumber,
  literalString,
  literalBoolean,
  literalTuple,
  literalList,
  literalListItem,
} from "../../../app/oz/machine/literals";
import {
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";

const parse = parserFor(expressionsGrammar);

describe("Parsing pattern matching statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles multiple pattern cases with statements and expressions", () => {
    expect(
      parse(
        "case X of person then A = B 5 [] animal then B = C 10 [] mineral then C = D 15 else skip 20 end",
      ),
    ).toEqual(
      patternMatchingExpression(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
            expression: literalExpression(literalNumber(5)),
          },
          {
            pattern: literalRecord("animal"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("B")),
              identifierExpression(lexicalIdentifier("C")),
            ),
            expression: literalExpression(literalNumber(10)),
          },
          {
            pattern: literalRecord("mineral"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            expression: literalExpression(literalNumber(15)),
          },
        ],
        {
          statement: skipStatementSyntax(),
          expression: literalExpression(literalNumber(20)),
        },
      ),
    );
  });

  it("handles multiple pattern cases with expressions", () => {
    expect(
      parse(
        "case X of person then 5 [] animal then 10 [] mineral then 15 else 20 end",
      ),
    ).toEqual(
      patternMatchingExpression(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: undefined,
            expression: literalExpression(literalNumber(5)),
          },
          {
            pattern: literalRecord("animal"),
            statement: undefined,
            expression: literalExpression(literalNumber(10)),
          },
          {
            pattern: literalRecord("mineral"),
            statement: undefined,
            expression: literalExpression(literalNumber(15)),
          },
        ],
        {
          statement: undefined,
          expression: literalExpression(literalNumber(20)),
        },
      ),
    );
  });

  it("handles no else clause", () => {
    expect(parse("case X of person then 5 end")).toEqual(
      patternMatchingExpression(identifierExpression(lexicalIdentifier("X")), [
        {
          pattern: literalRecord("person"),
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
      ]),
    );
  });

  it("handles expressions", () => {
    expect(parse("case A + B of person then 5 else 10 end")).toEqual(
      patternMatchingExpression(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        [
          {
            pattern: literalRecord("person"),
            statement: undefined,
            expression: literalExpression(literalNumber(5)),
          },
        ],
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      ),
    );
  });

  describe("patterns", () => {
    const simpleCaseWithPattern = pattern =>
      patternMatchingExpression(identifierExpression(lexicalIdentifier("X")), [
        {
          pattern,
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
      ]);

    it("handles identifiers", () => {
      expect(parse("case X of Y then 5 end")).toEqual(
        simpleCaseWithPattern(lexicalIdentifier("Y")),
      );
    });

    it("handles numbers", () => {
      expect(parse("case X of 12 then 5 end")).toEqual(
        simpleCaseWithPattern(literalNumber(12)),
      );
    });

    it("handles atoms", () => {
      expect(parse("case X of person then 5 end")).toEqual(
        simpleCaseWithPattern(literalAtom("person")),
      );
    });

    it("handles strings", () => {
      expect(parse('case X of "ABC" then 5 end')).toEqual(
        simpleCaseWithPattern(literalString("ABC")),
      );
    });

    it("handles booleans", () => {
      expect(parse("case X of true then 5 end")).toEqual(
        simpleCaseWithPattern(literalBoolean(true)),
      );
    });

    it("handles generic records", () => {
      expect(
        parse(
          "case X of person(name:N address:address(number:172 street:S)) then 5 end",
        ),
      ).toEqual(
        simpleCaseWithPattern(
          literalRecord("person", {
            name: lexicalIdentifier("N"),
            address: literalRecord("address", {
              number: literalNumber(172),
              street: lexicalIdentifier("S"),
            }),
          }),
        ),
      );
    });

    it("handles generic tuples", () => {
      expect(parse("case X of vector(10 Y 20#Z) then 5 end")).toEqual(
        simpleCaseWithPattern(
          literalTuple("vector", [
            literalNumber(10),
            lexicalIdentifier("Y"),
            literalTuple("#", [literalNumber(20), lexicalIdentifier("Z")]),
          ]),
        ),
      );
    });

    it("handles generic lists", () => {
      expect(parse("case X of [10 Y H|T] then 5 end")).toEqual(
        simpleCaseWithPattern(
          literalList([
            literalNumber(10),
            lexicalIdentifier("Y"),
            literalListItem(lexicalIdentifier("H"), lexicalIdentifier("T")),
          ]),
        ),
      );
    });

    it("handles any identifier in generic tuples", () => {
      expect(parse("case X of vector(10 _ 20#_) then 5 end")).toEqual(
        simpleCaseWithPattern(
          literalTuple("vector", [
            literalNumber(10),
            lexicalIdentifier("_"),
            literalTuple("#", [literalNumber(20), lexicalIdentifier("_")]),
          ]),
        ),
      );
    });

    it("handles any identifier as identifier", () => {
      expect(parse("case X of _ then 5 end")).toEqual(
        simpleCaseWithPattern(lexicalIdentifier("_")),
      );
    });

    it("handles any identifier in feture record", () => {
      expect(parse("case X of person(age:30 name:_) then 5 end")).toEqual(
        simpleCaseWithPattern(
          literalRecord("person", {
            age: literalNumber(30),
            name: lexicalIdentifier("_"),
          }),
        ),
      );
    });

    it("handles any identifier in features of nested record", () => {
      expect(
        parse("case X of person(name:_ address:address(number:_)) then 5 end"),
      ).toEqual(
        simpleCaseWithPattern(
          literalRecord("person", {
            name: lexicalIdentifier("_"),
            address: literalRecord("address", {
              number: lexicalIdentifier("_"),
            }),
          }),
        ),
      );
    });

    it("handles any identifier in lists", () => {
      expect(parse("case X of [10 _ H|_] then 5 end")).toEqual(
        simpleCaseWithPattern(
          literalList([
            literalNumber(10),
            lexicalIdentifier("_"),
            literalListItem(lexicalIdentifier("H"), lexicalIdentifier("_")),
          ]),
        ),
      );
    });
  });
});
