import Immutable from "immutable";
import { compilers } from "../../app/oz/compilation";
import { allStatementSyntaxTypes } from "../../app/oz/machine/statementSyntax";
import {
  kernelLiteralTypes,
  compilableLiteralTypes,
} from "../../app/oz/machine/literals";
import {
  kernelExpressionTypes,
  compilableExpressionTypes,
} from "../../app/oz/machine/expressions";

const allLiteralTypes = Object.keys(kernelLiteralTypes).concat(
  Object.keys(compilableLiteralTypes),
);
const allExpressionTypes = Object.keys(kernelExpressionTypes).concat(
  Object.keys(compilableExpressionTypes),
);

describe("Compiling", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a compiler for all statement types", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.statement));
    const types = Immutable.Set(allStatementSyntaxTypes);

    expect(typesWithCompiler).toEqual(types);
  });

  it("has a compiler for all literals", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.literal));
    const types = Immutable.Set(allLiteralTypes);

    expect(typesWithCompiler).toEqual(types);
  });

  it("has a compiler for all expressions", () => {
    const typesWithCompiler = Immutable.Set(Object.keys(compilers.expression));
    const types = Immutable.Set(allExpressionTypes);

    expect(typesWithCompiler).toEqual(types);
  });
});
