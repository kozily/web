import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { identifierExpression } from "../../app/oz/machine/expressions";
import {
  patternMatchingStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { literalRecord } from "../../app/oz/machine/literals";

describe("Printing a pattern matching statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = patternMatchingStatement(
      identifierExpression(lexicalIdentifier("X")),
      literalRecord("person", {
        age: lexicalIdentifier("A"),
        name: lexicalIdentifier("N"),
      }),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Y")),
        identifierExpression(lexicalIdentifier("A")),
      ),
      bindingStatement(
        identifierExpression(lexicalIdentifier("Z")),
        identifierExpression(lexicalIdentifier("N")),
      ),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual(
      "  case X of person(age:A name:N) then ... end",
    );
    expect(result.full).toEqual(
      "  case X of person(age:A name:N) then\n    Y = A\n  else\n    Z = N\n  end",
    );
  });
});
