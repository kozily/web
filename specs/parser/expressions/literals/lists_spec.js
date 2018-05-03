import Immutable from "immutable";
import {
  listExpression,
  listItemExpression,
  identifierExpression,
  numberExpression,
} from "./helpers";
import { parserFor } from "../../../../app/oz/parser";
import grammar from "../../../../app/oz/grammar/expressions.ne";

const parse = parserFor(grammar);

describe("Parsing list literal expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("handles empty lists correctly", () => {
    const list = listExpression();
    expect(parse("[]")).toEqual(list);
    expect(parse("[ ]")).toEqual(list);
  });

  it("handles lists with one element", () => {
    const list = listExpression([identifierExpression("X")]);
    expect(parse("[X]")).toEqual(list);
    expect(parse("[ X ]")).toEqual(list);
  });

  it("handles lists with more than 1 element correctly", () => {
    const list = listExpression([
      identifierExpression("X"),
      identifierExpression("Y"),
      identifierExpression("Z"),
    ]);
    expect(parse("[X Y Z]")).toEqual(list);
    expect(parse("[X   Y Z]")).toEqual(list);
  });

  it("handles lists with more than 1 same element correctly", () => {
    const list = listExpression([
      identifierExpression("X"),
      identifierExpression("A"),
      identifierExpression("Y"),
      identifierExpression("Z"),
      identifierExpression("Z"),
      identifierExpression("A"),
    ]);
    expect(parse("[X A Y Z Z A]")).toEqual(list);
  });

  it("handles nested literals", () => {
    const list = listExpression([
      numberExpression(1),
      numberExpression(2),
      listExpression([numberExpression(3), numberExpression(4)]),
    ]);
    expect(parse("[1 2 [3 4]]")).toEqual(list);
  });

  it("handles piped literals", () => {
    const list = listItemExpression(
      identifierExpression("H"),
      identifierExpression("T"),
    );
    expect(parse("H|T")).toEqual(list);
  });

  it("handles repeated piped literals with identifiers", () => {
    const list = listItemExpression(
      identifierExpression("R"),
      listItemExpression(identifierExpression("S"), identifierExpression("T")),
    );
    expect(parse("R|S|T")).toEqual(list);
  });

  it("handles repeated piped literals with literals", () => {
    const list = listItemExpression(
      numberExpression(1),
      listItemExpression(numberExpression(2), identifierExpression("T")),
    );
    expect(parse("1|2|T")).toEqual(list);
  });

  it("handles nested piped literals", () => {
    const list = listItemExpression(
      numberExpression(1),
      listItemExpression(
        numberExpression(2),
        listExpression([numberExpression(3)]),
      ),
    );
    expect(parse("1|2|[3]")).toEqual(list);
  });
});
