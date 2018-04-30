import Immutable from "immutable";
import {
  sequenceStatement,
  bindingStatement,
  skipStatement,
} from "../../app/oz/machine/statements";
import {
  buildSingleThreadedState,
  buildEnvironment,
  buildSemanticStatement,
  buildVariable,
} from "../../app/oz/machine/build";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { identifierExpression } from "../../app/oz/machine/expressions";
import reduce from "../../app/oz/execution/sequence";

describe("Reducing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    const sharedEnvironment = buildEnvironment({
      X: buildVariable("x", 0),
    });

    const statement = buildSemanticStatement(
      sequenceStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        bindingStatement(
          identifierExpression(lexicalIdentifier("C")),
          identifierExpression(lexicalIdentifier("D")),
        ),
      ),
      sharedEnvironment,
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(skipStatement()),
        ],
      }),
    );
  });

  it("reduces sequences of sequence correctly", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    const sharedEnvironment = buildEnvironment({
      X: buildVariable("x", 0),
    });

    const statement = buildSemanticStatement(
      sequenceStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        sequenceStatement(
          bindingStatement(
            identifierExpression(lexicalIdentifier("B")),
            identifierExpression(lexicalIdentifier("C")),
          ),
          sequenceStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            bindingStatement(
              identifierExpression(lexicalIdentifier("D")),
              identifierExpression(lexicalIdentifier("E")),
            ),
          ),
        ),
      ),
      sharedEnvironment,
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("B")),
              identifierExpression(lexicalIdentifier("C")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("D")),
              identifierExpression(lexicalIdentifier("E")),
            ),
            sharedEnvironment,
          ),
          buildSemanticStatement(skipStatement()),
        ],
      }),
    );
  });

  it("reduces using the same environment index", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [
        buildSemanticStatement(skipStatement(), buildEnvironment(), {
          environmentIndex: 0,
        }),
      ],
    });

    const sharedEnvironment = buildEnvironment({
      X: buildVariable("x", 0),
    });

    const statement = buildSemanticStatement(
      sequenceStatement(
        bindingStatement(
          identifierExpression(lexicalIdentifier("A")),
          identifierExpression(lexicalIdentifier("B")),
        ),
        bindingStatement(
          identifierExpression(lexicalIdentifier("C")),
          identifierExpression(lexicalIdentifier("D")),
        ),
      ),
      sharedEnvironment,
      { environmentIndex: 0 },
    );

    expect(reduce(state, statement, 0)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("A")),
              identifierExpression(lexicalIdentifier("B")),
            ),
            sharedEnvironment,
            { environmentIndex: 0 },
          ),
          buildSemanticStatement(
            bindingStatement(
              identifierExpression(lexicalIdentifier("C")),
              identifierExpression(lexicalIdentifier("D")),
            ),
            sharedEnvironment,
            { environmentIndex: 0 },
          ),
          buildSemanticStatement(skipStatement(), buildEnvironment(), {
            environmentIndex: 0,
          }),
        ],
      }),
    );
  });
});
