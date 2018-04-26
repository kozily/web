import { buildEnvironment } from "../machine/build";
import { collectFreeIdentifiers } from "../free_identifiers";

export default (recurse, environment, literal) => {
  const freeIdentifiers = collectFreeIdentifiers(literal);

  const context = freeIdentifiers.reduce((accumulator, identifier) => {
    return accumulator.set(identifier, environment.get(identifier));
  }, buildEnvironment());

  return literal.set("node", "value").setIn(["value", "context"], context);
};
