import Immutable from "immutable";
import { print } from "../../../app/oz/print";
import {
  threadStatement,
  skipStatement,
} from "../../../app/oz/machine/statements";

describe("Printing a thread statement", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("Returns the appropriate string", () => {
    const statement = threadStatement(skipStatement());
    const result = print(statement, 2);

    expect(result.abbreviated).toEqual("  thread ... end");
    expect(result.full).toEqual("  thread\n    skip\n  end");
  });
});
