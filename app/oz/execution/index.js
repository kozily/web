import { statementTypes } from "../machine/statements";
import skip from "./skip";
import sequence from "./sequence";
import local from "./local";
import binding from "./binding";
import valueCreation from "./value_creation";
import conditional from "./conditional";
import patternMatching from "./pattern_matching";
import procedureApplication from "./procedure_application";

export const executors = {
  [statementTypes.skip]: skip,
  [statementTypes.sequence]: sequence,
  [statementTypes.local]: local,
  [statementTypes.binding]: binding,
  [statementTypes.valueCreation]: valueCreation,
  [statementTypes.conditional]: conditional,
  [statementTypes.patternMatching]: patternMatching,
  [statementTypes.procedureApplication]: procedureApplication,
};

export const execute = (state, semanticStatement) => {
  const executor = executors[semanticStatement.getIn(["statement", "type"])];
  return executor(state, semanticStatement);
};
