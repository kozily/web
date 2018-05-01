import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import { skipStatement } from "../../../app/oz/machine/statements";

describe("Compiling skip statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = skipStatementSyntax();

    expect(compile(statement)).toEqual(skipStatement());
  });
});
