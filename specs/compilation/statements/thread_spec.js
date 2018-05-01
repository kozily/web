import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  threadStatementSyntax,
  skipStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  threadStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";

describe("Compiling thread statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const statement = threadStatementSyntax(skipStatementSyntax());

    expect(compile(statement)).toEqual(threadStatement(skipStatement()));
  });
});
