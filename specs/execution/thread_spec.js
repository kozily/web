import Immutable from "immutable";
import {
  threadStatement,
  bindingStatement,
} from "../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  buildState,
  buildThread,
  buildEnvironment,
  buildVariable,
  buildSemanticStatement,
} from "../../app/oz/machine/build";
import reduce from "../../app/oz/execution/thread";

describe("Reducing thread statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("reduces correctly", () => {
    const state = buildState({
      threads: [
        buildThread({
          semanticStatements: [
            buildSemanticStatement(
              bindingStatement(lexicalIdentifier("X"), lexicalIdentifier("Y")),
              buildEnvironment({
                X: buildVariable("x", 0),
                Y: buildVariable("y", 0),
              }),
            ),
          ],
        }),
      ],
    });
    const statement = buildSemanticStatement(
      threadStatement(
        bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
      ),
      buildEnvironment({
        A: buildVariable("a", 0),
        B: buildVariable("b", 0),
      }),
    );

    expect(reduce(state, statement)).toEqual(
      buildState({
        threads: [
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                bindingStatement(
                  lexicalIdentifier("X"),
                  lexicalIdentifier("Y"),
                ),
                buildEnvironment({
                  X: buildVariable("x", 0),
                  Y: buildVariable("y", 0),
                }),
              ),
            ],
          }),
          buildThread({
            semanticStatements: [
              buildSemanticStatement(
                bindingStatement(
                  lexicalIdentifier("A"),
                  lexicalIdentifier("B"),
                ),
                buildEnvironment({
                  A: buildVariable("a", 0),
                  B: buildVariable("b", 0),
                }),
              ),
            ],
          }),
        ],
      }),
    );
  });
});
