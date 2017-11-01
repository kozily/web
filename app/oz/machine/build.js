import Immutable from "immutable";

export const buildEnvironment = (contents = {}) => {
  return new Immutable.Map(contents);
};

export const buildSemanticStatement = (
  statement,
  environment = buildEnvironment(),
) => {
  return new Immutable.Map({
    statement,
    environment,
  });
};

export const buildStack = (...semanticStatements) => {
  return new Immutable.Stack(semanticStatements);
};

export const buildVariable = (name, sequence) => {
  return new Immutable.Map({
    name,
    sequence,
  });
};

export const buildEquivalenceClass = (value, ...variables) => {
  return new Immutable.Map({
    value,
    variables: new Immutable.Set(variables),
  });
};

export const buildStore = (...equivalenceClasses) => {
  return new Immutable.Set(equivalenceClasses);
};

export const buildState = (stack = buildStack(), store = buildStore()) => {
  return new Immutable.Map({
    stack,
    store,
  });
};

export const buildFromKernelAST = ast => {
  return buildState(buildStack(buildSemanticStatement(ast)));
};
