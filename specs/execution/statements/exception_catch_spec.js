import Immutable from "immutable";
import {
  skipStatement,
  exceptionCatchStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import { identifierExpression } from "../../../app/oz/machine/expressions";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
} from "../../../app/oz/machine/build";
import { execute } from "../../../app/oz/execution";

describe("Reducing catch statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("executes correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    const statement = buildSemanticStatement(
      exceptionCatchStatement(
        lexicalIdentifier("X"),
        bindingStatement(
          identifierExpression(lexicalIdentifier("X")),
          identifierExpression(lexicalIdentifier("Y")),
        ),
      ),
    );

    expect(execute(state, statement)).toEqual(state);
  });
});
