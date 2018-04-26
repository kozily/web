import Immutable from "immutable";
import {
  skipStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { valueNumber } from "../../app/oz/machine/values";
import { failureException } from "../../app/oz/machine/exceptions";
import { buildSystemExceptionState } from "./helpers";
import {
  buildSingleThreadedState,
  buildSemanticStatement,
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/binding";
import { getLastEnvironmentIndex } from "../../app/oz/machine/environment";

describe("Reducing X=Y statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("raises a system exception when values are incompatible", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      sigma: buildSigma(
        buildEquivalenceClass(
          valueNumber(100),
          buildVariable("x", 0),
          buildVariable("x", 1),
        ),
        buildEquivalenceClass(
          valueNumber(200),
          buildVariable("y", 0),
          buildVariable("y", 1),
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

    expect(reduce(state, statement, 0)).toEqual(
      buildSystemExceptionState(state, 0, failureException()),
    );
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

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
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

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(
            undefined,
            buildVariable("z", 0),
            buildVariable("z", 1),
          ),
          buildEquivalenceClass(
            undefined,
            buildVariable("x", 0),
            buildVariable("x", 1),
            buildVariable("y", 0),
            buildVariable("y", 1),
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

    expect(reduce(state, statement, 0)).toEqual(
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

  it("reduces keeping the environment index", () => {
    const lastIndex = getLastEnvironmentIndex();
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement(), buildEnvironment(), {
          environmentIndex: lastIndex,
        }),
      ],
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
      { environmentIndex: lastIndex },
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(skipStatement(), buildEnvironment(), {
            environmentIndex: lastIndex,
          }),
        ],
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
