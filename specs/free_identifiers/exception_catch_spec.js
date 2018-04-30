import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  exceptionCatchStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Collecting free identifiers in a catch statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects substatement identifiers except for the exception identifier", () => {
    const statement = exceptionCatchStatement(
      lexicalIdentifier("X"),
      bindingStatement(
        identifierExpression(lexicalIdentifier("A")),
        identifierExpression(lexicalIdentifier("X")),
      ),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["A"]));
  });
});
