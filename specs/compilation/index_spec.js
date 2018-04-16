import Immutable from "immutable";
import { compilers } from "../../app/oz/compilation";
import { allStatementSyntaxTypes } from "../../app/oz/machine/statementSyntax";
import { allLiteralTypes } from "../../app/oz/machine/literals";

describe("Compiling", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a compiler for all types", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.statement));
    const types = Immutable.Set(allStatementSyntaxTypes);

    expect(typesWithCompiler).toEqual(types);
  });

  it("has a compiler for all literals", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.literal));
    const types = Immutable.Set(allLiteralTypes);

    expect(typesWithCompiler).toEqual(types);
  });
});
