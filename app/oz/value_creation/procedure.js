import { buildEnvironment } from "../machine/build";
import { collectFreeIdentifiers } from "../free_identifiers";

export default (environment, literal) => {
  const freeIdentifiers = collectFreeIdentifiers(literal);

  const context = freeIdentifiers.reduce((accumulator, identifier) => {
    return accumulator.set(identifier, environment.get(identifier));
  }, buildEnvironment());

  return literal.delete("node").setIn(["value", "context"], context);
};
