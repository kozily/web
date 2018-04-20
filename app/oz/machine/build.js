import Immutable from "immutable";
import { lexicalIdentifier } from "./lexical";
import { valueRecord, valueBuiltIn } from "./values";
import { builtIns, allBuiltInTypes } from "./built_ins.js";

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

export const defaultEnvironment = () =>
  buildEnvironment(
    allBuiltInTypes.reduce((environment, builtInType) => {
      const builtInTypeVariable = buildVariable(builtInType.toLowerCase(), 0);

      return environment.set(builtInType, builtInTypeVariable);
    }, Immutable.Map()),
  );

export const defaultSigma = () =>
  Immutable.Set(
    allBuiltInTypes.reduce((sigma, builtInType) => {
      const builtInOperators = builtIns[builtInType];
      const builtInTypeVariable = buildVariable(builtInType.toLowerCase(), 0);

      const features = Object.keys(builtInOperators).reduce(
        (acc, operatorKey) => {
          const operatorVariable = buildVariable(
            builtInOperators[operatorKey].name.toLowerCase(),
            0,
          );
          return acc.set(operatorKey, operatorVariable);
        },
        Immutable.Map(),
      );

      const recordEquivalenceClass = buildEquivalenceClass(
        valueRecord(builtInType, features),
        builtInTypeVariable,
      );

      const operatorsEquivalenceClasses = Object.keys(builtInOperators).reduce(
        (sigma, operatorKey) => {
          const operatorVariable = buildVariable(
            builtInOperators[operatorKey].name.toLowerCase(),
            0,
          );

          const operatorValue = valueBuiltIn(operatorKey, builtInType);

          return sigma.add(
            buildEquivalenceClass(operatorValue, operatorVariable),
          );
        },
        Immutable.Set(),
      );

      return sigma
        .add(recordEquivalenceClass)
        .union(operatorsEquivalenceClasses);
    }, Immutable.Set()),
  );

export const buildFromKernelAST = ast => {
  return buildSingleThreadedState({
    semanticStatements: [buildSemanticStatement(ast, defaultEnvironment())],
    sigma: defaultSigma(),
  });
};

var argumentIndex = 0;

export const makeAuxiliaryIdentifier = (namespace = "") => {
  return lexicalIdentifier(`@${namespace.toUpperCase()}_${argumentIndex++}`);
};

export const getLastAuxiliaryIdentifier = (namespace = "") => {
  return lexicalIdentifier(`@${namespace.toUpperCase()}_${argumentIndex - 1}`);
};
