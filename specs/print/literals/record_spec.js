import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import {
  literalRecord,
  literalAtom,
  literalBoolean,
  literalTuple,
  literalList,
  literalListItem,
  literalNumber,
} from "../../../app/oz/machine/literals";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  identifierExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";

describe("Printing a record literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when using literal records in expression context", () => {
    it("Returns the appropriate string for standard records", () => {
      const literal = literalRecord("person", {
        name: identifierExpression(lexicalIdentifier("N")),
        age: literalExpression(literalNumber(30)),
      });
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person(age:30 name:N)");
      expect(result.full).toEqual("person(age:30 name:N)");
    });

    it("Returns the appropriate string for atoms", () => {
      const literal = literalAtom("person");
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person");
      expect(result.full).toEqual("person");
    });

    it("Returns the appropriate string for booleans", () => {
      const literal = literalBoolean(true);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("true");
      expect(result.full).toEqual("true");
    });

    it("Returns the appropriate string for generic tuples", () => {
      const literal = literalTuple("person", [
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(30)),
      ]);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person(X 30)");
      expect(result.full).toEqual("person(X 30)");
    });

    it("Returns the appropriate string for cons tuples", () => {
      const literal = literalTuple("#", [
        identifierExpression(lexicalIdentifier("X")),
        literalExpression(literalNumber(30)),
        literalExpression(literalNumber(35)),
      ]);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("X#30#35");
      expect(result.full).toEqual("X#30#35");
    });

    it("Returns the appropriate string for lists", () => {
      const literal = literalList(
        [
          identifierExpression(lexicalIdentifier("X")),
          literalExpression(literalNumber(30)),
        ],
        literalExpression,
      );
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("[X 30]");
      expect(result.full).toEqual("[X 30]");
    });

    it("Returns the appropriate string for list conses", () => {
      const literal = literalListItem(
        literalExpression(literalNumber(30)),
        identifierExpression(lexicalIdentifier("Y")),
      );
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("30|Y");
      expect(result.full).toEqual("30|Y");
    });

    it("Returns the appropriate string for weird list conses", () => {
      const literal = literalListItem(
        literalExpression(literalNumber(10)),
        literalExpression(
          literalListItem(
            literalExpression(literalNumber(20)),
            literalExpression(literalNumber(30)),
          ),
        ),
      );
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("10|20|30");
      expect(result.full).toEqual("10|20|30");
    });

    it("Returns the appropriate string for nested recursive structures", () => {
      const literal = literalRecord("person", {
        age: literalExpression(literalNumber(30)),
        address: literalExpression(
          literalRecord("address", {
            number: literalExpression(literalNumber(1300)),
          }),
        ),
      });
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual(
        "person(address:address(number:1300) age:30)",
      );
      expect(result.full).toEqual(
        "person(address:address(number:1300) age:30)",
      );
    });
  });

  describe("when using literal records in pattern context", () => {
    it("Returns the appropriate string for standard records", () => {
      const literal = literalRecord("person", {
        name: lexicalIdentifier("N"),
        age: literalNumber(30),
      });
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person(age:30 name:N)");
      expect(result.full).toEqual("person(age:30 name:N)");
    });

    it("Returns the appropriate string for atoms", () => {
      const literal = literalAtom("person");
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person");
      expect(result.full).toEqual("person");
    });

    it("Returns the appropriate string for booleans", () => {
      const literal = literalBoolean(true);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("true");
      expect(result.full).toEqual("true");
    });

    it("Returns the appropriate string for generic tuples", () => {
      const literal = literalTuple("person", [
        lexicalIdentifier("X"),
        literalNumber(30),
      ]);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("person(X 30)");
      expect(result.full).toEqual("person(X 30)");
    });

    it("Returns the appropriate string for cons tuples", () => {
      const literal = literalTuple("#", [
        lexicalIdentifier("X"),
        literalNumber(30),
        literalNumber(35),
      ]);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("X#30#35");
      expect(result.full).toEqual("X#30#35");
    });

    it("Returns the appropriate string for lists", () => {
      const literal = literalList([lexicalIdentifier("X"), literalNumber(30)]);
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("[X 30]");
      expect(result.full).toEqual("[X 30]");
    });

    it("Returns the appropriate string for list conses", () => {
      const literal = literalListItem(
        literalNumber(30),
        lexicalIdentifier("Y"),
      );
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("30|Y");
      expect(result.full).toEqual("30|Y");
    });

    it("Returns the appropriate string for weird list conses", () => {
      const literal = literalListItem(
        literalNumber(10),
        literalListItem(literalNumber(20), literalNumber(30)),
      );
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual("10|20|30");
      expect(result.full).toEqual("10|20|30");
    });

    it("Returns the appropriate string for nested recursive structures", () => {
      const literal = literalRecord("person", {
        age: literalNumber(30),
        address: literalRecord("address", {
          number: literalNumber(1300),
        }),
      });
      const result = print(literal, 2);

      expect(result.abbreviated).toEqual(
        "person(address:address(number:1300) age:30)",
      );
      expect(result.full).toEqual(
        "person(address:address(number:1300) age:30)",
      );
    });
  });
});
