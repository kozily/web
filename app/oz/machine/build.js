import Immutable from "immutable";
import { lexicalIdentifier } from "./lexical";
import { valueRecord, valueBuiltIn } from "./values";
import { builtIns, allBuiltInTypes } from "../built_ins";

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

export const buildVariable = (name, sequence, { system = false } = {}) => {
  return Immutable.Map({
    name,
    sequence,
    system,
  });
};

export const buildEquivalenceClass = (value, ...variables) => {
  return Immutable.Map({
    value,
    variables: Immutable.OrderedSet(variables),
  });
};

export const buildSigma = (...equivalenceClasses) => {
  return Immutable.OrderedSet(equivalenceClasses);
};

export const buildTrigger = (procedure, neededVariable) => {
  return Immutable.fromJS({
    procedure,
    neededVariable,
  });
};

export const buildTau = (...triggers) => {
  return Immutable.OrderedSet(triggers);
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
      const builtInTypeVariable = buildVariable(builtInType.toLowerCase(), 0, {
        system: true,
      });

      return environment.set(builtInType, builtInTypeVariable);
    }, buildEnvironment()),
  );

export const defaultSigma = () =>
  Immutable.OrderedSet(
    allBuiltInTypes.reduce((sigma, builtInType) => {
      const builtInOperators = builtIns[builtInType];
      const builtInTypeVariable = buildVariable(builtInType.toLowerCase(), 0, {
        system: true,
      });

      const features = Object.keys(builtInOperators).reduce(
        (acc, operatorKey) => {
          const operatorVariable = buildVariable(
            builtInOperators[operatorKey].name.toLowerCase(),
            0,
            { system: true },
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
            { system: true },
          );

          const operatorValue = valueBuiltIn(operatorKey, builtInType);

          return sigma.add(
            buildEquivalenceClass(operatorValue, operatorVariable),
          );
        },
        buildSigma(),
      );

      return sigma
        .add(recordEquivalenceClass)
        .union(operatorsEquivalenceClasses);
    }, Immutable.OrderedSet()),
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
