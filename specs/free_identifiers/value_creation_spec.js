import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  valueCreationStatement,
  bindingStatement,
  sequenceStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import {
  literalNumber,
  literalRecord,
  literalProcedure,
} from "../samples/literals";

describe("Collecting free identifiers in a value creation statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when the created value is an integer", () => {
    it("collects the lhs identifier", () => {
      const statement = valueCreationStatement(
        lexicalIdentifier("X"),
        literalNumber(155),
      );

      expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["X"]));
    });
  });

  describe("when the created value is a record", () => {
    it("collects the lhs identifier and all the identifiers in the record", () => {
      const statement = valueCreationStatement(
        lexicalIdentifier("X"),
        literalRecord("person", {
          age: lexicalIdentifier("A"),
          name: lexicalIdentifier("N"),
        }),
      );

      expect(collectFreeIdentifiers(statement)).toEqual(
        Immutable.Set(["X", "A", "N"]),
      );
    });
  });

  describe("when the created value is a procedure", () => {
    it("collects the lhs identifier and all the identifiers in the procedure", () => {
      const statement = valueCreationStatement(
        lexicalIdentifier("X"),
        literalProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          sequenceStatement(
            bindingStatement(lexicalIdentifier("Y"), lexicalIdentifier("A")),
            bindingStatement(lexicalIdentifier("B"), lexicalIdentifier("Z")),
          ),
        ),
      );

      expect(collectFreeIdentifiers(statement)).toEqual(
        Immutable.Set(["X", "Y", "Z"]),
      );
    });
  });
});
