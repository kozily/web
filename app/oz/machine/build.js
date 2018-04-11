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

export const buildThreadMetadata = ({ status = "ready" } = {}) => {
  return Immutable.Map({
    status,
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

export const buildSingleThreadedState = ({
  semanticStatements = [],
  sigma = buildSigma(),
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
  });
};

export const buildState = ({ threads = [], sigma = buildSigma() } = {}) => {
  return Immutable.Map({
    threads: Immutable.List(threads),
    sigma,
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
