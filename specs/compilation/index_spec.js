import Immutable from "immutable";
import { compilers } from "../../app/oz/compilation";
import { allStatementSyntaxTypes } from "../../app/oz/machine/statementSyntax";
import { allValueTypes } from "../../app/oz/machine/values";

describe("Compiling", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a compiler for all types", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.statement));
    const types = Immutable.Set(allStatementSyntaxTypes);

    expect(typesWithCompiler).toEqual(types);
  });

  it("has a compiler for all values", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.literal));
    const types = Immutable.Set(allValueTypes);

    expect(typesWithCompiler).toEqual(types);
  });
});
