import Immutable from "immutable";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  operatorExpression,
} from "../../../app/oz/machine/expressions";
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
  patternMatchingStatementSyntax,
  sequenceStatementSyntax,
  skipStatementSyntax,
  bindingStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import parse from "../../../app/oz/parser";

describe("Parsing case statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles multiple pattern cases", () => {
    expect(
      parse(
        "case X of person then A = B [] animal then B = C [] mineral then C = D else skip end",
      ),
    ).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
          },
          {
            pattern: literalRecord("animal"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("B")),
              identifierExpression(lexicalIdentifier("C")),
            ),
          },
          {
            pattern: literalRecord("mineral"),
            statement: bindingStatementSyntax(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });

  it("handles no else clause", () => {
    expect(parse("case X of person then skip end")).toEqual(
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern: literalRecord("person"),
            statement: skipStatementSyntax(),
          },
        ],
      ),
    );
  });

  it("handles expressions", () => {
    expect(parse("case A + B of person then skip skip else skip end")).toEqual(
      patternMatchingStatementSyntax(
        operatorExpression(
          "+",
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        [
          {
            pattern: literalRecord("person"),
            statement: sequenceStatementSyntax(
              skipStatementSyntax(),
              skipStatementSyntax(),
            ),
          },
        ],
        skipStatementSyntax(),
      ),
    );
  });

  describe("patterns", () => {
    const simpleCaseWithPattern = pattern =>
      patternMatchingStatementSyntax(
        identifierExpression(lexicalIdentifier("X")),
        [
          {
            pattern,
            statement: skipStatementSyntax(),
          },
        ],
      );

    it("handles identifiers", () => {
      expect(parse("case X of Y then skip end")).toEqual(
        simpleCaseWithPattern(lexicalIdentifier("Y")),
      );
    });

    it("handles numbers", () => {
      expect(parse("case X of 12 then skip end")).toEqual(
        simpleCaseWithPattern(literalNumber(12)),
      );
    });

    it("handles atoms", () => {
      expect(parse("case X of person then skip end")).toEqual(
        simpleCaseWithPattern(literalAtom("person")),
      );
    });

    it("handles strings", () => {
      expect(parse('case X of "ABC" then skip end')).toEqual(
        simpleCaseWithPattern(literalString("ABC")),
      );
    });

    it("handles booleans", () => {
      expect(parse("case X of true then skip end")).toEqual(
        simpleCaseWithPattern(literalBoolean(true)),
      );
    });

    it("handles generic records", () => {
      expect(
        parse(
          "case X of person(name:N address:address(number:172 street:S)) then skip end",
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
      expect(parse("case X of vector(10 Y 20#Z) then skip end")).toEqual(
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
      expect(parse("case X of [10 Y H|T] then skip end")).toEqual(
        simpleCaseWithPattern(
          literalList([
            literalNumber(10),
            lexicalIdentifier("Y"),
            literalListItem(lexicalIdentifier("H"), lexicalIdentifier("T")),
          ]),
        ),
      );
    });
  });
});
