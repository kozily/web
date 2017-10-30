import {
  buildEquivalenceClass,
  buildVariable,
  buildSemanticStatement,
} from "../machine/build";

const identifier2variable = identifier => {
  return identifier.charAt(0).toLowerCase() + identifier.substring(1);
};

const makeNewVariable = ({ in: store, for: identifier }) => {
  const variableName = identifier2variable(identifier);

  const currentMaximumVariable = store
    .flatMap(equivalence => equivalence.get("variables"))
    .filter(variable => variable.get("name") === variableName)
    .maxBy(variable => variable.get("sequence"));

  if (currentMaximumVariable === undefined) {
    return buildVariable(variableName, 0);
  }

  return currentMaximumVariable.update("sequence", sequence => sequence + 1);
};

export default function(state, semanticStatement) {
  const identifier = semanticStatement.getIn([
    "statement",
    "variable",
    "identifier",
  ]);
  const childStatement = semanticStatement.getIn(["statement", "statement"]);

  const newVariable = makeNewVariable({
    in: state.get("store"),
    for: identifier,
  });
  const newEquivalenceClass = buildEquivalenceClass(undefined, newVariable);
  const newEnvironment = semanticStatement
    .get("environment")
    .set(identifier, newVariable);
  const newSemanticStatement = buildSemanticStatement(
    childStatement,
    newEnvironment,
  );

  return state
    .update("store", store => store.push(newEquivalenceClass))
    .update("stack", stack => stack.push(newSemanticStatement));
}
