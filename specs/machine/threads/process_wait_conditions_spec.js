import Immutable from "immutable";
import { skipStatement } from "../../../app/oz/machine/statements";
import { valueNumber } from "../../../app/oz/machine/values";
import {
  buildSingleThreadedState,
  threadStatus,
  buildThreadMetadata,
  buildVariable,
  buildSigma,
  buildEquivalenceClass,
  buildSemanticStatement,
} from "../../../app/oz/machine/build";
import { processWaitConditions } from "../../../app/oz/machine/threads";

describe("threads#processWaitConditions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("does not fail when there are no blocked threads", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
    });

    expect(processWaitConditions(state)).toEqual(state);
  });

  it("does not mark a thread as ready when the wait condition is false", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      threadMetadata: buildThreadMetadata({
        status: threadStatus.blocked,
        waitCondition: buildVariable("x", 0),
      }),
      sigma: buildSigma(
        buildEquivalenceClass(undefined, buildVariable("x", 0)),
      ),
    });

    expect(processWaitConditions(state)).toEqual(state);
  });

  it("marks a thread as ready when the wait condition is true", () => {
    const state = buildSingleThreadedState({
      semanticStatements: [buildSemanticStatement(skipStatement())],
      threadMetadata: buildThreadMetadata({
        status: threadStatus.blocked,
        waitCondition: buildVariable("x", 0),
      }),
      sigma: buildSigma(
        buildEquivalenceClass(valueNumber(5), buildVariable("x", 0)),
      ),
    });

    expect(processWaitConditions(state)).toEqual(
      buildSingleThreadedState({
        semanticStatements: [buildSemanticStatement(skipStatement())],
        sigma: buildSigma(
          buildEquivalenceClass(valueNumber(5), buildVariable("x", 0)),
        ),
      }),
    );
  });
});
