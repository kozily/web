import Immutable from "immutable";
import { buildEnvironment } from "../../machine/build";
import { collectFreeIdentifiers } from "../../free_identifiers";
import { valueProcedure } from "../../machine/values";

export default (recurse, literal, environment) => {
  const freeIdentifiers = collectFreeIdentifiers(literal);

  const args = literal.getIn(["value", "args"]);
  const body = literal.getIn(["value", "body"]);

  const context = freeIdentifiers.reduce((accumulator, identifier) => {
    return accumulator.set(identifier, environment.get(identifier));
  }, buildEnvironment());

  const value = valueProcedure(args, body, context);

  return Immutable.fromJS({
    value,
  });
};
