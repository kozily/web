import { literalProcedure } from "../../machine/literals";

export default (recurse, literal) => {
  const args = literal.getIn(["value", "args"]);
  const body = recurse(literal.getIn(["value", "body"]));
  return literalProcedure(args, body);
};
