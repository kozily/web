import { lookupVariableInStore } from "../machine/store";
import { buildSemanticStatement } from "../machine/build";

export default function(state, semanticStatement) {
  const store = state.get("store");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const identifier = statement.getIn(["condition", "identifier"]);
  const trueStatement = statement.getIn(["true_statement"]);
  const falseStatement = statement.getIn(["false_statement"]);

  const variable = environment.get(identifier);
  const equivalentClass = lookupVariableInStore(store, variable);

  const value = equivalentClass.get("value");

  if (value === undefined) throw new Error("Unbound value in if condition");

  if (value.get("type") !== "record")
    throw new Error(`Wrong type in if condition [type: ${value.get("type")}]`);

  if (!value.getIn(["value", "features"]).isEmpty())
    throw new Error("The condition record must not have features");

  const label = value.getIn(["value", "label"]);
  if (label === "true") {
    const newSemanticStatement = buildSemanticStatement(
      trueStatement,
      environment,
    );
    return state.update("stack", stack => stack.push(newSemanticStatement));
  } else if (label === "false") {
    const newSemanticStatement = buildSemanticStatement(
      falseStatement,
      environment,
    );
    return state.update("stack", stack => stack.push(newSemanticStatement));
  } else {
    throw new Error(
      `Unexpected record label in if condition [label: ${label}]`,
    );
  }
}
