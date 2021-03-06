import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { byNeedStatement } from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";

describe("Printing a by need statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = byNeedStatement(
      identifierExpression(lexicalIdentifier("OneVariable")),
      lexicalIdentifier("OtherVariable"),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  {ByNeed OneVariable OtherVariable}");
    expect(result.full).toEqual("  {ByNeed OneVariable OtherVariable}");
  });
});
