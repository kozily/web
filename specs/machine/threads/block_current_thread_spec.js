import Immutable from "immutable";
import {
  skipStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  threadStatus,
  buildState,
  buildThread,
  buildThreadMetadata,
  buildEnvironment,
  buildVariable,
  buildSemanticStatement,
} from "../../../app/oz/machine/build";
import { blockCurrentThread } from "../../../app/oz/machine/threads";

describe("threads#blockCurrentThread", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("blocks the current thread", () => {
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
        buildThread({
          semanticStatements: [
            buildSemanticStatement(
              bindingStatement(lexicalIdentifier("A"), lexicalIdentifier("B")),
              buildEnvironment({
                A: buildVariable("x", 0),
                B: buildVariable("y", 0),
              }),
            ),
          ],
        }),
      ],
    });

    const blockingStatement = buildSemanticStatement(
      skipStatement(),
      buildEnvironment({
        Z: buildVariable("x", 0),
      }),
    );

    const blockedState = blockCurrentThread(
      state,
      blockingStatement,
      1,
      buildVariable("x", 0),
    );

    expect(blockedState).toEqual(
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
              blockingStatement,
              buildSemanticStatement(
                bindingStatement(
                  lexicalIdentifier("A"),
                  lexicalIdentifier("B"),
                ),
                buildEnvironment({
                  A: buildVariable("x", 0),
                  B: buildVariable("y", 0),
                }),
              ),
            ],
            metadata: buildThreadMetadata({
              status: threadStatus.blocked,
              waitCondition: buildVariable("x", 0),
            }),
          }),
        ],
      }),
    );
  });
});
