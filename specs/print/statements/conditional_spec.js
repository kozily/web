import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import {
  conditionalStatement,
  skipStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Printing a conditional statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = conditionalStatement(
      identifierExpression(lexicalIdentifier("Variable")),
      skipStatement(),
      bindingStatement(
        identifierExpression(lexicalIdentifier("X")),
        identifierExpression(lexicalIdentifier("Y")),
      ),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  if Variable then ... else ... end");
    expect(result.full).toEqual(
      "  if Variable then\n    skip\n  else\n    X = Y\n  end",
    );
  });
});
