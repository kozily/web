import Immutable from "immutable";
import { statementTypes } from "../machine/statements";
import { literalTypes } from "../machine/literals";
import { expressionTypes } from "../machine/expressions";
import skip from "./skip";
import binding from "./binding";
import sequence from "./sequence";
import conditional from "./conditional";
import local from "./local";
import patternMatching from "./pattern_matching";
import procedureApplication from "./procedure_application";
import exceptionContext from "./exception_context";
import exceptionRaise from "./exception_raise";
import exceptionCatch from "./exception_catch";
import thread from "./thread";
import byNeed from "./by_need";
import cellCreation from "./cell_creation";
import portCreation from "./port_creation";
import portSend from "./port_send";
import nameCreation from "./name_creation";
import number from "./number";
import record from "./record";
import procedure from "./procedure";
import literalExpression from "./literal_expression";
import identifierExpression from "./identifier_expression";
import operatorExpression from "./operator_expression";

export const collectors = {
  statement: {
    [statementTypes.skip]: skip,
    [statementTypes.binding]: binding,
    [statementTypes.sequence]: sequence,
    [statementTypes.conditional]: conditional,
    [statementTypes.local]: local,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: procedureApplication,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: exceptionRaise,
    [statementTypes.exceptionCatch]: exceptionCatch,
    [statementTypes.thread]: thread,
    [statementTypes.byNeed]: byNeed,
    [statementTypes.cellCreation]: cellCreation,
    [statementTypes.portCreation]: portCreation,
    [statementTypes.portSend]: portSend,
    [statementTypes.nameCreation]: nameCreation,
  },
  literal: {
    [literalTypes.number]: number,
    [literalTypes.record]: record,
    [literalTypes.procedure]: procedure,
  },
  expression: {
    [expressionTypes.literal]: literalExpression,
    [expressionTypes.identifier]: identifierExpression,
    [expressionTypes.operator]: operatorExpression,
  },
};

export const collectFreeIdentifiers = node => {
  if (!node) {
    return Immutable.Set();
  }
  const collector = collectors[node.get("node")][node.get("type")];
  return collector(collectFreeIdentifiers, node);
};
