import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  literalProcedure,
  literalFunction,
  literalNumber,
} from "../../../app/oz/machine/literals";
import { getLastAuxiliaryIdentifier } from "../../../app/oz/machine/build";
import {
  literalExpression,
  identifierExpression,
} from "../../../app/oz/machine/expressions";
import { skipStatementSyntax } from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  sequenceStatement,
  bindingStatement,
} from "../../../app/oz/machine/statements";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";

describe("Compiling function values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles appropriately", () => {
    const literal = literalFunction(
      [lexicalIdentifier("A"), lexicalIdentifier("B")],
      literalExpression(literalNumber(5)),
      skipStatementSyntax(),
    );

    expect(compile(literal)).toEqual(
      literalProcedure(
        [
          lexicalIdentifier("A"),
          lexicalIdentifier("B"),
          getLastAuxiliaryIdentifier("res"),
        ],
        sequenceStatement(
          skipStatement(),
          bindingStatement(
            identifierExpression(getLastAuxiliaryIdentifier("res")),
            literalExpression(literalNumber(5)),
          ),
        ),
      ),
    );
  });
});
