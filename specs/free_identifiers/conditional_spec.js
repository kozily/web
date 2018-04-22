import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { identifierExpression } from "../../app/oz/machine/expressions";
import {
  conditionalStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a conditional statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all identifiers from the condition and all substatements", () => {
    const statement = conditionalStatement(
      identifierExpression(lexicalIdentifier("Z")),
      bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
    );

    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["Z", "A", "B", "X", "Y"]),
    );
  });
});
