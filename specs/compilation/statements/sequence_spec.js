import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  sequenceStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  sequenceStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";

describe("Compiling sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = sequenceStatementSyntax(
      skipStatementSyntax(),
      skipStatementSyntax(),
    );

    expect(compile(statement)).toEqual(
      sequenceStatement(skipStatement(), skipStatement()),
    );
  });
});
