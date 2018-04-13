import { statementTypes } from "../machine/statements";
import skip from "./skip";
import sequence from "./sequence";
import local from "./local";
import binding from "./binding";
import valueCreation from "./value_creation";
import conditional from "./conditional";
import patternMatching from "./pattern_matching";
import procedureApplication from "./procedure_application";
import exceptionContext from "./exception_context";
import exceptionRaise from "./exception_raise";
import exceptionCatch from "./exception_catch";
import thread from "./thread";
import byNeed from "./by_need";

export const executors = {
  [statementTypes.skip]: skip,
  [statementTypes.sequence]: sequence,
  [statementTypes.local]: local,
  [statementTypes.binding]: binding,
  [statementTypes.valueCreation]: valueCreation,
  [statementTypes.conditional]: conditional,
  [statementTypes.patternMatching]: patternMatching,
  [statementTypes.procedureApplication]: procedureApplication,
  [statementTypes.exceptionContext]: exceptionContext,
  [statementTypes.exceptionRaise]: exceptionRaise,
  [statementTypes.exceptionCatch]: exceptionCatch,
  [statementTypes.thread]: thread,
  [statementTypes.byNeed]: byNeed,
};

export const execute = (state, semanticStatement, activeThreadIndex) => {
  const executor = executors[semanticStatement.getIn(["statement", "type"])];
  return executor(state, semanticStatement, activeThreadIndex);
};
