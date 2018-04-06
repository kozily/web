import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
  exceptionContextStatement,
  exceptionCatchStatement,
  bindingStatement,
} from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/exception_context";

describe("Reducing try statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("pushes the appropriate statements on the stack", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      exceptionContextStatement(
        sequenceStatement(skipStatement(), skipStatement()),
        lexicalIdentifier("Error"),
        bindingStatement(lexicalIdentifier("Error"), lexicalIdentifier("X")),
      ),
      buildEnvironment({
        X: buildVariable("x", 0),
      }),
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(
            exceptionCatchStatement(
              lexicalIdentifier("Error"),
              bindingStatement(
                lexicalIdentifier("Error"),
                lexicalIdentifier("X"),
              ),
            ),
            buildEnvironment({
              X: buildVariable("x", 0),
            }),
          ),
          buildSemanticStatement(skipStatement()),
        ],

        sigma: state.get("sigma"),
      }),
    );
  });
});
