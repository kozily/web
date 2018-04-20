import Immutable from "immutable";
import { compile } from "../../app/oz/compilation";
import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Compiling identifier expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const expression = identifierExpression(lexicalIdentifier("A"));

    expect(compile(expression)).toEqual(expression);
  });
});
