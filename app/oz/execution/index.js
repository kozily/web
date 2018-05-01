import { statementTypes } from "../machine/statements";
import skip from "./statements/skip";
import sequence from "./statements/sequence";
import local from "./statements/local";
import binding from "./statements/binding";
import conditional from "./statements/conditional";
import patternMatching from "./statements/pattern_matching";
import procedureApplication from "./statements/procedure_application";
import exceptionContext from "./statements/exception_context";
import exceptionRaise from "./statements/exception_raise";
import exceptionCatch from "./statements/exception_catch";
import thread from "./statements/thread";
import byNeed from "./statements/by_need";
import cellCreation from "./statements/cell_creation";
import cellExchange from "./statements/cell_exchange";
import portCreation from "./statements/port_creation";
import portSend from "./statements/port_send";
import nameCreation from "./statements/name_creation";

export const executors = {
  statement: {
    [statementTypes.skip]: skip,
    [statementTypes.sequence]: sequence,
    [statementTypes.local]: local,
    [statementTypes.binding]: binding,
    [statementTypes.conditional]: conditional,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: procedureApplication,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: exceptionRaise,
    [statementTypes.exceptionCatch]: exceptionCatch,
    [statementTypes.thread]: thread,
    [statementTypes.byNeed]: byNeed,
    [statementTypes.cellCreation]: cellCreation,
    [statementTypes.cellExchange]: cellExchange,
    [statementTypes.portCreation]: portCreation,
    [statementTypes.portSend]: portSend,
    [statementTypes.nameCreation]: nameCreation,
  },
};

export const execute = (state, semanticStatement, activeThreadIndex) => {
  const statement = semanticStatement.get("statement");
  const node = statement.get("node");
  const type = statement.get("type");
  const executor = executors[node][type];
  return executor(state, semanticStatement, activeThreadIndex);
};
