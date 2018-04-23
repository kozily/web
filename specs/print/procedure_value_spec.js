import Immutable from "immutable";
import { print } from "../../app/oz/print";
import { valueProcedure } from "../../app/oz/machine/values";
import { skipStatement, localStatement } from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { buildVariable } from "../../app/oz/machine/build";

describe("Printing a procedure value", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const value = valueProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      localStatement(lexicalIdentifier("X"), skipStatement()),
    );
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("proc {$ A B} local X in ... end end");
    expect(result.full).toEqual(
      "proc {$ A B}\n    local X in\n      skip\n    end\n  end, {}",
    );
  });

  it("Returns the appropriate string with a context environment with one variable", () => {
    const value = valueProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      localStatement(lexicalIdentifier("X"), skipStatement()),
      {
        Y: buildVariable("y", 0),
      },
    );
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("proc {$ A B} local X in ... end end");
    expect(result.full).toEqual(
      "proc {$ A B}\n    local X in\n      skip\n    end\n  end, {Y->y0}",
    );
  });

  it("Returns the appropriate string with a context environment with variable", () => {
    const value = valueProcedure(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      localStatement(lexicalIdentifier("X"), skipStatement()),
      {
        Y: buildVariable("y", 0),
        Z: buildVariable("z", 0),
      },
    );
    const result = print(value, 2);

    expect(result.abbreviated).toEqual("proc {$ A B} local X in ... end end");
    expect(result.full).toEqual(
      "proc {$ A B}\n    local X in\n      skip\n    end\n  end, {Y->y0,Z->z0}",
    );
  });
});
