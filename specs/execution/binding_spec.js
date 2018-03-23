import Immutable from "immutable";
import { skipStatement, bindingStatement } from "../samples/statements";
import { lexicalIdentifier } from "../samples/lexical";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/binding";

describe("Reducing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly when variables unbound and in different equivalence sets", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("x", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("y", 0),
          buildVariable("y", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("z", 0),
          buildVariable("z", 1),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
        ),
      }),
    );
  });

  it("reduces correctly when variables unbound and in the same equivalence sets", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("x", 1),
          buildVariable("y", 0),
          buildVariable("y", 1),
        ),
        buildEquivalenceClass(
          undefined,
          buildVariable("z", 0),
          buildVariable("z", 1),
        ),
      ),
    });

    const statement = buildSemanticStatement(
      bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
      buildEnvironment({
        X: buildVariable("x", 0),
        Y: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
        ),
      }),
    );
  });

  it("reduces correctly when variables unbound and in reverse order", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          undefined,
          buildVariable("x", 0),
          buildVariable("y", 0),
        ),
        buildEquivalenceClass(undefined, buildVariable("z", 0)),
      ),
    });

    const statement = buildSemanticStatement(
      bindingStatement(lexicalIdentifier("Z"), lexicalIdentifier("X")),
      buildEnvironment({
        Z: buildVariable("z", 0),
        X: buildVariable("y", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("x", 0),
            buildVariable("y", 0),
          ),
        ),
      }),
    );
  });
});
