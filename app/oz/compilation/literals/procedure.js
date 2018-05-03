import { literalProcedure } from "../../machine/literals";

export default (recurse, literal) => {
  const args = literal.getIn(["value", "args"]);
  const body = recurse(literal.getIn(["value", "body"]));
  const resultingExpression = literalProcedure(args, body);
  const augmentStatement = statement => statement;

  return {
    resultingExpression,
    augmentStatement,
  };
};
