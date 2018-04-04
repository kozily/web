import Immutable from "immutable";
import {
  skipStatement,
  exceptionCatchStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/exception_catch";

describe("Reducing catch statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    const statement = buildSemanticStatement(
      exceptionCatchStatement(
        lexicalIdentifier("X"),
        bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      ),
    );

    expect(reduce(state, statement)).toEqual(state);
  });
});
