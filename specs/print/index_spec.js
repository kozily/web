import Immutable from "immutable";
import { printers, print } from "../../app/oz/print";
import { allStatementTypes } from "../../app/oz/machine/statements";
import { kernelLiteralTypes } from "../../app/oz/machine/literals";
import { allValueTypes } from "../../app/oz/machine/values";
import { kernelExpressionTypes } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

const allLiteralTypes = Object.keys(kernelLiteralTypes);
const allExpressionTypes = Object.keys(kernelExpressionTypes);

describe("Printing", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("has a printer for all types", () => {
    const typesWithPrinters = Immutable.Set(Object.keys(printers.statement));
    const types = Immutable.Set(allStatementTypes);

    expect(typesWithPrinters).toEqual(types);
  });

  it("has a printer for all literals", () => {
    const literalsWithPrinters = Immutable.Set(Object.keys(printers.literal));
    const literals = Immutable.Set(allLiteralTypes);

    expect(literalsWithPrinters).toEqual(literals);
  });

  it("has a printer for all values", () => {
    const valuesWithPrinters = Immutable.Set(Object.keys(printers.value));
    const values = Immutable.Set(allValueTypes);

    expect(valuesWithPrinters).toEqual(values);
  });

  it("has a printer for all expressions", () => {
    const expressionsWithPrinters = Immutable.Set(
      Object.keys(printers.expression),
    );
    const values = Immutable.Set(allExpressionTypes);

    expect(expressionsWithPrinters).toEqual(values);
  });

  it("has a special printer for identifiers", () => {
    const identifier = lexicalIdentifier("_");
    const result = print(identifier, 2);
    expect(result.abbreviated).toEqual("_");
    expect(result.full).toEqual("_");
  });
});
