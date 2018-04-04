import Immutable from "immutable";
import {
  skipStatement,
  sequenceStatement,
} from "../../../app/oz/machine/statements";
import parse from "../../../app/oz/parser";

describe("Parsing sequence statements", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles a single space between statements correctly", () => {
    expect(parse("skip skip")).toEqual(
      sequenceStatement(skipStatement(), skipStatement()),
    );
  });

  it("handles multiple whitespace characters correctly", () => {
    expect(parse("skip\n\t  skip")).toEqual(
      sequenceStatement(skipStatement(), skipStatement()),
    );
  });

  it("handles multiple nested sequences correctly", () => {
    expect(parse("skip skip skip")).toEqual(
      sequenceStatement(
        skipStatement(),
        sequenceStatement(skipStatement(), skipStatement()),
      ),
    );
  });
});
