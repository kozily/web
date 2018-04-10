import { valueProcedure } from "../machine/values";

export default (recurse, literal) => {
  const args = literal.getIn(["value", "args"]);
  const body = recurse(literal.getIn(["value", "body"]));
  return valueProcedure(args, body);
};
