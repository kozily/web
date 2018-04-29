import { statementSyntaxTypes } from "../machine/statementSyntax";
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
import cellCreation from "./cell_creation";
import portCreation from "./port_creation";
import portSend from "./port_send";
import nameCreation from "./name_creation";
import thread from "./thread";
import byNeed from "./by_need";
import number from "./number";
import record from "./record";
import procedure from "./procedure";
import literalExpression from "./literal_expression";
import identifierExpression from "./identifier_expression";
import operatorExpression from "./operator_expression";

export const compilers = {
  statement: {
    [statementSyntaxTypes.skipSyntax]: skip,
    [statementSyntaxTypes.bindingSyntax]: binding,
    [statementSyntaxTypes.sequenceSyntax]: sequence,
    [statementSyntaxTypes.conditionalSyntax]: conditional,
    [statementSyntaxTypes.localSyntax]: local,
    [statementSyntaxTypes.valueCreationSyntax]: valueCreation,
    [statementSyntaxTypes.patternMatchingSyntax]: patternMatching,
    [statementSyntaxTypes.procedureApplicationSyntax]: procedureApplication,
    [statementSyntaxTypes.exceptionContextSyntax]: exceptionContext,
    [statementSyntaxTypes.exceptionRaiseSyntax]: exceptionRaise,
    [statementSyntaxTypes.threadSyntax]: thread,
    [statementSyntaxTypes.byNeedSyntax]: byNeed,
    [statementSyntaxTypes.cellCreationSyntax]: cellCreation,
    [statementSyntaxTypes.portCreationSyntax]: portCreation,
    [statementSyntaxTypes.portSendSyntax]: portSend,
    [statementSyntaxTypes.nameCreationSyntax]: nameCreation,
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

export const compile = node => {
  if (!node) return null;
  const compiler = compilers[node.get("node")][node.get("type")];
  return compiler(compile, node);
};
