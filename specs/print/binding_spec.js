import Immutable from "immutable";
import { print } from "../../app/oz/print";
import {
  localStatement,
  skipStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { literalProcedure, literalNumber } from "../../app/oz/machine/literals";
import {
  identifierExpression,
  literalExpression,
} from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

describe("Printing a binding statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string when using inline values", () => {
    const statement = bindingStatement(
      identifierExpression(lexicalIdentifier("X")),
      literalExpression(literalNumber(158)),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  X = 158");
    expect(result.full).toEqual("  X = 158");
  });

  it("Returns the appropriate string when using expanded values", () => {
    const statement = bindingStatement(
      identifierExpression(lexicalIdentifier("X")),
      literalExpression(
        literalProcedure(
          [lexicalIdentifier("A"), lexicalIdentifier("B")],
          localStatement(lexicalIdentifier("Y"), skipStatement()),
        ),
      ),
    );
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual(
      "  X = proc {$ A B} local Y in ... end end",
    );
    expect(result.full).toEqual(
      "  X = proc {$ A B}\n    local Y in\n      skip\n    end\n  end",
    );
  });
});
