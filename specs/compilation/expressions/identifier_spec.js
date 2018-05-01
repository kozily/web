import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { skipStatement } from "../../../app/oz/machine/statements";

describe("Compiling identifier expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const expression = identifierExpression(lexicalIdentifier("A"));

    const compilation = compile(expression);

    expect(compilation.resultingExpression).toEqual(expression);

    const resultingStatement = compilation.augmentStatement(skipStatement());

    expect(resultingStatement).toEqual(skipStatement());
  });
});
