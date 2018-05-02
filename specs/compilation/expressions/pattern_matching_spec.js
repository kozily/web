import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  patternMatchingExpression,
  literalExpression,
} from "../../../app/oz/machine/expressions";
import {
  skipStatementSyntax,
  sequenceStatementSyntax,
} from "../../../app/oz/machine/statementSyntax";
import {
  skipStatement,
  localStatement,
  sequenceStatement,
  bindingStatement,
  patternMatchingStatement,
} from "../../../app/oz/machine/statements";
import { literalNumber, literalRecord } from "../../../app/oz/machine/literals";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling pattern matching statement expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles a single clause with else clause having both statements and expressions", () => {
      const expression = patternMatchingExpression(
        identifier("X"),
        [
          {
            pattern: literalRecord("person"),
            statement: skipStatementSyntax(),
            expression: literalExpression(literalNumber(5)),
          },
        ],
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            patternMatchingStatement(
              identifier("X"),
              literalRecord("person"),
              sequenceStatement(
                skipStatement(),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(5)),
                ),
              ),
              sequenceStatement(
                sequenceStatement(skipStatement(), skipStatement()),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(10)),
                ),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles a single clause with else clause having expressions", () => {
      const expression = patternMatchingExpression(
        identifier("X"),
        [
          {
            pattern: literalRecord("person"),
            statement: undefined,
            expression: literalExpression(literalNumber(5)),
          },
        ],
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            patternMatchingStatement(
              identifier("X"),
              literalRecord("person"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(5)),
              ),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(10)),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles a single clause without else clause having expressions", () => {
      const expression = patternMatchingExpression(identifier("X"), [
        {
          pattern: literalRecord("person"),
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
      ]);

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            patternMatchingStatement(
              identifier("X"),
              literalRecord("person"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(5)),
              ),
              skipStatement(),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles multiple clauses without else clause having expressions", () => {
      const expression = patternMatchingExpression(identifier("X"), [
        {
          pattern: literalRecord("person"),
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          pattern: literalRecord("animal"),
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      ]);

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            patternMatchingStatement(
              identifier("X"),
              literalRecord("person"),
              bindingStatement(
                auxExpression(),
                literalExpression(literalNumber(5)),
              ),
              patternMatchingStatement(
                identifier("X"),
                literalRecord("animal"),
                bindingStatement(
                  auxExpression(),
                  literalExpression(literalNumber(10)),
                ),
                skipStatement(),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles a single clause with else clause having both statements and expressions", () => {
      const expression = patternMatchingExpression(
        identifier("X"),
        [
          {
            pattern: literalRecord("person"),
            statement: skipStatementSyntax(),
            expression: literalExpression(literalNumber(5)),
          },
        ],
        {
          statement: sequenceStatementSyntax(
            skipStatementSyntax(),
            skipStatementSyntax(),
          ),
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        patternMatchingStatement(
          identifier("X"),
          literalRecord("person"),
          sequenceStatement(
            skipStatement(),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(5)),
            ),
          ),
          sequenceStatement(
            sequenceStatement(skipStatement(), skipStatement()),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(10)),
            ),
          ),
        ),
      );
    });

    it("compiles a single clause with else clause having expressions", () => {
      const expression = patternMatchingExpression(
        identifier("X"),
        [
          {
            pattern: literalRecord("person"),
            statement: undefined,
            expression: literalExpression(literalNumber(5)),
          },
        ],
        {
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        patternMatchingStatement(
          identifier("X"),
          literalRecord("person"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(5)),
          ),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(10)),
          ),
        ),
      );
    });

    it("compiles a single clause without else clause having expressions", () => {
      const expression = patternMatchingExpression(identifier("X"), [
        {
          pattern: literalRecord("person"),
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
      ]);

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        patternMatchingStatement(
          identifier("X"),
          literalRecord("person"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(5)),
          ),
          skipStatement(),
        ),
      );
    });

    it("compiles multiple clauses without else clause having expressions", () => {
      const expression = patternMatchingExpression(identifier("X"), [
        {
          pattern: literalRecord("person"),
          statement: undefined,
          expression: literalExpression(literalNumber(5)),
        },
        {
          pattern: literalRecord("animal"),
          statement: undefined,
          expression: literalExpression(literalNumber(10)),
        },
      ]);

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());
      expect(resultingStatement).toEqual(
        patternMatchingStatement(
          identifier("X"),
          literalRecord("person"),
          bindingStatement(
            identifier("R"),
            literalExpression(literalNumber(5)),
          ),
          patternMatchingStatement(
            identifier("X"),
            literalRecord("animal"),
            bindingStatement(
              identifier("R"),
              literalExpression(literalNumber(10)),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });
});
