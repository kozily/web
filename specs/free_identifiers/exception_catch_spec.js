import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import {
  exceptionCatchStatement,
  bindingStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";

describe("Collecting free identifiers in a catch statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects substatement identifiers except for the exception identifier", () => {
    const statement = exceptionCatchStatement(
      lexicalIdentifier("X"),
      bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("X")),
    );
    expect(collectFreeIdentifiers(statement)).toEqual(Immutable.Set(["A"]));
  });
});
