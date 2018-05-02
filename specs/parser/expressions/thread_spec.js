import Immutable from "immutable";
import { parserFor } from "../../../app/oz/parser";
import expressionsGrammar from "../../../app/oz/grammar/expressions.ne";
import {
  threadExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import { literalNumber } from "../../../app/oz/machine/literals";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";

const parse = parserFor(expressionsGrammar);

describe("Parsing thread statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("parses", () => {
    expect(parse("thread skip 5 end")).toEqual(
      threadExpression(
        literalExpression(literalNumber(5)),
        skipStatementSyntax(),
      ),
    );
  });
});
