import { statementTypes } from "../machine/statements";
import { literalTypes } from "../machine/literals";
import { expressionTypes } from "../machine/expressions";
import skip from "./skip";
import binding from "./binding";
import sequence from "./sequence";
import conditional from "./conditional";
import local from "./local";
import valueCreation from "./value_creation";
import patternMatching from "./pattern_matching";
import procedureApplication from "./procedure_application";
import exceptionContext from "./exception_context";
import exceptionRaise from "./exception_raise";
import exceptionCatch from "./exception_catch";
import thread from "./thread";
import byNeed from "./by_need";
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
    [statementTypes.valueCreation]: valueCreation,
    [statementTypes.patternMatching]: patternMatching,
    [statementTypes.procedureApplication]: procedureApplication,
    [statementTypes.exceptionContext]: exceptionContext,
    [statementTypes.exceptionRaise]: exceptionRaise,
    [statementTypes.exceptionCatch]: exceptionCatch,
    [statementTypes.thread]: thread,
    [statementTypes.byNeed]: byNeed,
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
  const collector = collectors[node.get("node")][node.get("type")];
  return collector(collectFreeIdentifiers, node);
};
