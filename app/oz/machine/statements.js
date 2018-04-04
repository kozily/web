export const statementTypes = {
  skip: "skip",
  sequence: "sequence",
  local: "local",
  binding: "binding",
  valueCreation: "valueCreation",
  conditional: "conditional",
  patternMatching: "patternMatching",
  procedureApplication: "procedureApplication",
  exceptionContext: "exceptionContext",
  exceptionRaise: "exceptionRaise",
  exceptionCatch: "exceptionCatch",
};

export const allStatementTypes = Object.keys(statementTypes);
