import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  exceptionCatchStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";

describe("Printing an exception catch statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = exceptionCatchStatement(
      lexicalIdentifier("E"),
      bindingStatement(
        identifierExpression(lexicalIdentifier("E")),
        identifierExpression(lexicalIdentifier("C")),
      ),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  catch E then ... end");
    expect(result.full).toEqual("  catch E then\n    E = C\n  end");
  });
});
