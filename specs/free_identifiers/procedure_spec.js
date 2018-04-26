import Immutable from "immutable";
import { collectFreeIdentifiers } from "../../app/oz/free_identifiers";
import { literalProcedure } from "../../app/oz/machine/literals";
import {
  bindingStatement,
  sequenceStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Collecting free identifiers in a number literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("collects all the identifiers in the procedure", () => {
    const literal = literalProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      sequenceStatement(
        bindingStatement(lexicalIdentifier("Y"), lexicalIdentifier("A")),
        bindingStatement(lexicalIdentifier("B"), lexicalIdentifier("Z")),
      ),
    );

    expect(collectFreeIdentifiers(literal)).toEqual(Immutable.Set(["Y", "Z"]));
  });
});
