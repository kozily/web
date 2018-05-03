import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import { literalRecord } from "../../../app/oz/machine/literals";
import {
  identifierExpression,
  functionExpression,
} from "../../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../../app/oz/machine/lexical";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
} from "../../../app/oz/machine/statements";
import { auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling record values", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("compiles featuresless records", () => {
    const literal = literalRecord("person");

    const compilation = compile(literal);

    expect(compilation.resultingExpression).toEqual(literal);

    const resultingStatement = compilation.augmentStatement(skipStatement());
    expect(resultingStatement).toEqual(skipStatement());
  });

  it("compiles unexpandable expressions", () => {
    const literal = literalRecord("person", {
      age: identifierExpression(lexicalIdentifier("A")),
      name: identifierExpression(lexicalIdentifier("N")),
    });

    const compilation = compile(literal);

    expect(compilation.resultingExpression).toEqual(literal);

    const resultingStatement = compilation.augmentStatement(skipStatement());
    expect(resultingStatement).toEqual(skipStatement());
  });

  it("compiles expandable expressions", () => {
    const literal = literalRecord("person", {
      age: functionExpression(identifierExpression(lexicalIdentifier("Get"))),
    });

    const compilation = compile(literal);

    expect(compilation.resultingExpression).toEqual(
      literalRecord("person", {
        age: auxExpression(),
      }),
    );

    const resultingStatement = compilation.augmentStatement(skipStatement());
    expect(resultingStatement).toEqual(
      localStatement(
        auxExpressionIdentifier(),
        sequenceStatement(
          procedureApplicationStatement(
            identifierExpression(lexicalIdentifier("Get")),
            [auxExpression()],
          ),
          skipStatement(),
        ),
      ),
    );
  });
});
