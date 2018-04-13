import Immutable from "immutable";
import { lexicalIdentifier } from "./lexical";

export const buildEnvironment = (contents = {}) => {
  return Immutable.Map(contents);
};

export const buildSemanticStatement = (
  statement,
  environment = buildEnvironment(),
) => {
  return Immutable.Map({
    statement,
    environment,
  });
};

export const threadStatus = {
  ready: "ready",
  blocked: "blocked",
};

export const buildThreadMetadata = ({
  status = threadStatus.ready,
  waitCondition = null,
  current = false,
} = {}) => {
  return Immutable.Map({
    status,
    waitCondition,
    current,
  });
};

export const buildThread = ({
  metadata = buildThreadMetadata(),
  semanticStatements = [],
} = {}) => {
  return Immutable.Map({
    stack: Immutable.Stack(semanticStatements),
    metadata,
  });
};

export const buildVariable = (name, sequence) => {
  return Immutable.Map({
    name,
    sequence,
  });
};

export const buildEquivalenceClass = (value, ...variables) => {
  return Immutable.Map({
    value,
    variables: Immutable.Set(variables),
  });
};

export const buildSigma = (...equivalenceClasses) => {
  return Immutable.Set(equivalenceClasses);
};

export const buildTrigger = (procedure, neededVariable) => {
  return Immutable.fromJS({
    procedure,
    neededVariable,
  });
};

export const buildTau = (...triggers) => {
  return Immutable.Set(triggers);
};

export const buildSingleThreadedState = ({
  semanticStatements = [],
  sigma = buildSigma(),
  tau = buildTau(),
  threadMetadata = buildThreadMetadata(),
} = {}) => {
  return buildState({
    threads: [
      buildThread({
        semanticStatements,
        metadata: threadMetadata,
      }),
    ],
    sigma,
    tau,
  });
};

export const buildState = ({
  threads = [],
  sigma = buildSigma(),
  tau = buildTau(),
} = {}) => {
  return Immutable.Map({
    threads: Immutable.List(threads),
    sigma,
    tau,
  });
};

export const buildFromKernelAST = ast => {
  return buildSingleThreadedState({
    semanticStatements: [buildSemanticStatement(ast)],
  });
};

var argumentIndex = 0;

export const makeAuxiliaryIdentifier = () => {
  return lexicalIdentifier(`__${argumentIndex++}__`);
};

export const getLastAuxiliaryIdentifier = () => {
  return lexicalIdentifier(`__${argumentIndex - 1}__`);
};
