import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../../app/oz/free_identifiers";
import {
  operatorExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Collecting free identifiers in a operator expression", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects the free identifiers of the children", () => {
    const statement = operatorExpression(
      "+",
      identifierExpression(lexicalIdentifier("A")),
      identifierExpression(lexicalIdentifier("B")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(
      Immutable.Set(["A", "B"]),
    );
  });
});
