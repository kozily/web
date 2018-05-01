import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import { literalProcedure } from "../../../app/oz/machine/literals";
import {
  skipStatement,
  localStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Printing a procedure literal", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const literal = literalProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      localStatement(lexicalIdentifier("X"), skipStatement()),
    );
    const result = print(literal, 2);

    expect(result.abbreviated).toEqual("proc {$ A B} local X in ... end end");
    expect(result.full).toEqual(
      "proc {$ A B}\n    local X in\n      skip\n    end\n  end",
    );
  });
});
