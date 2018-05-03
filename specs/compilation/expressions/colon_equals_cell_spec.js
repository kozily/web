import Immutable from "immutable";
import { compile } from "../../../app/oz/compilation";
import {
  functionExpression,
  colonEqualsCellExpression,
} from "../../../app/oz/machine/expressions";
import {
  localStatement,
  sequenceStatement,
  procedureApplicationStatement,
  skipStatement,
  cellExchangeStatement,
} from "../../../app/oz/machine/statements";
import { identifier, auxExpression, auxExpressionIdentifier } from "../helpers";

describe("Compiling colon equals cell expressions", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  describe("when not providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = colonEqualsCellExpression(
        identifier("C"),
        identifier("Y"),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression());

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(),
          sequenceStatement(
            cellExchangeStatement(
              identifier("C"),
              auxExpressionIdentifier(),
              identifier("Y"),
            ),
            skipStatement(),
          ),
        ),
      );
    });

    it("compiles recursive expressions in the function position", () => {
      const expression = colonEqualsCellExpression(
        functionExpression(identifier("GetFunction1")),
        functionExpression(identifier("GetFunction2")),
      );

      const compilation = compile(expression);

      expect(compilation.resultingExpression).toEqual(auxExpression(3));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      //{GetFunction}:={GetFunction}
      //Rc={Exchange E0 _ E1}
      //Ac=local E0 in
      //    {GetFunction E0}
      //    local E1 in
      //      {GetFunction E1}
      //      local E2 in
      //        {Exchange E0 E2 E1}
      //        skip
      //
      //    end
      //  end
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(3),
          sequenceStatement(
            localStatement(
              auxExpressionIdentifier(2),
              sequenceStatement(
                procedureApplicationStatement(identifier("GetFunction1"), [
                  auxExpression(2),
                ]),
                localStatement(
                  auxExpressionIdentifier(1),
                  sequenceStatement(
                    procedureApplicationStatement(identifier("GetFunction2"), [
                      auxExpression(1),
                    ]),
                    cellExchangeStatement(
                      auxExpression(2),
                      auxExpressionIdentifier(3),
                      auxExpression(1),
                    ),
                  ),
                ),
              ),
            ),
            skipStatement(),
          ),
        ),
      );
    });
  });

  describe("when providing a resulting identifier", () => {
    it("compiles", () => {
      const expression = colonEqualsCellExpression(
        identifier("C"),
        identifier("Y"),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      expect(resultingStatement).toEqual(
        cellExchangeStatement(
          identifier("C"),
          identifier("R").get("identifier"),
          identifier("Y"),
        ),
      );
    });

    it("compiles recursive expressions in function position", () => {
      const expression = colonEqualsCellExpression(
        functionExpression(identifier("GetFunction1")),
        functionExpression(identifier("GetFunction2")),
      );

      const compilation = compile(expression, identifier("R"));

      expect(compilation.resultingExpression).toEqual(identifier("R"));

      const resultingStatement = compilation.augmentStatement(skipStatement());

      //{GetFunction}:={GetFunction}
      //Rc={Exchange E0 _ E1}
      //Ac=local E0 in
      //    {GetFunction E0}
      //    local E1 in
      //      {GetFunction E1}
      //      local E2 in
      //        {Exchange E0 R E1}
      //        skip
      //      end
      //    end
      //  end
      expect(resultingStatement).toEqual(
        localStatement(
          auxExpressionIdentifier(2),
          sequenceStatement(
            procedureApplicationStatement(identifier("GetFunction1"), [
              auxExpression(2),
            ]),
            localStatement(
              auxExpressionIdentifier(1),
              sequenceStatement(
                procedureApplicationStatement(identifier("GetFunction2"), [
                  auxExpression(1),
                ]),
                cellExchangeStatement(
                  auxExpression(2),
                  identifier("R").get("identifier"),
                  auxExpression(1),
                ),
              ),
            ),
          ),
        ),
      );
    });
  });
});
