import { statementSyntaxTypes } from "../machine/statementSyntax";
import {
  kernelLiteralTypes,
  compilableLiteralTypes,
} from "../machine/literals";
import {
  kernelExpressionTypes,
  compilableExpressionTypes,
} from "../machine/expressions";
import skip from "./statements/skip";
import binding from "./statements/binding";
import sequence from "./statements/sequence";
import conditional from "./statements/conditional";
import local from "./statements/local";
import patternMatching from "./statements/pattern_matching";
import procedureApplication from "./statements/procedure_application";
import exceptionContext from "./statements/exception_context";
import exceptionRaise from "./statements/exception_raise";
import cellCreation from "./statements/cell_creation";
import cellExchange from "./statements/cell_exchange";
import portCreation from "./statements/port_creation";
import portSend from "./statements/port_send";
import nameCreation from "./statements/name_creation";
import thread from "./statements/thread";
import byNeed from "./statements/by_need";
import colonEqualsCellSyntax from "./statements/colon_equals_cell";
import number from "./literals/number";
import record from "./literals/record";
import procedure from "./literals/procedure";
import functionLiteral from "./literals/function";
import literalExpression from "./expressions/literal";
import identifierExpression from "./expressions/identifier";
import operatorExpression from "./expressions/operator";
import functionExpression from "./expressions/function";
import localExpression from "./expressions/local";
import conditionalExpression from "./expressions/conditional";
import patternMatchingExpression from "./expressions/pattern_matching";
import exceptionContextExpression from "./expressions/exception_context";
import threadExpression from "./expressions/thread";
import nameCreationExpression from "./expressions/name_creation";
import cellCreationExpression from "./expressions/cell_creation";
import portCreationExpression from "./expressions/port_creation";
import atCellExpression from "./expressions/at_cell";
import colonEqualsCellExpression from "./expressions/colon_equals_cell";

export const compilers = {
  statement: {
    [statementSyntaxTypes.skipSyntax]: skip,
    [statementSyntaxTypes.bindingSyntax]: binding,
    [statementSyntaxTypes.sequenceSyntax]: sequence,
    [statementSyntaxTypes.conditionalSyntax]: conditional,
    [statementSyntaxTypes.localSyntax]: local,
    [statementSyntaxTypes.patternMatchingSyntax]: patternMatching,
    [statementSyntaxTypes.procedureApplicationSyntax]: procedureApplication,
    [statementSyntaxTypes.exceptionContextSyntax]: exceptionContext,
    [statementSyntaxTypes.exceptionRaiseSyntax]: exceptionRaise,
    [statementSyntaxTypes.threadSyntax]: thread,
    [statementSyntaxTypes.byNeedSyntax]: byNeed,
    [statementSyntaxTypes.cellCreationSyntax]: cellCreation,
    [statementSyntaxTypes.cellExchangeSyntax]: cellExchange,
    [statementSyntaxTypes.portCreationSyntax]: portCreation,
    [statementSyntaxTypes.portSendSyntax]: portSend,
    [statementSyntaxTypes.nameCreationSyntax]: nameCreation,
    [statementSyntaxTypes.colonEqualsCellSyntax]: colonEqualsCellSyntax,
  },
  literal: {
    [kernelLiteralTypes.number]: number,
    [kernelLiteralTypes.record]: record,
    [kernelLiteralTypes.procedure]: procedure,
    [compilableLiteralTypes.function]: functionLiteral,
  },
  expression: {
    [kernelExpressionTypes.literal]: literalExpression,
    [kernelExpressionTypes.identifier]: identifierExpression,
    [kernelExpressionTypes.operator]: operatorExpression,
    [compilableExpressionTypes.function]: functionExpression,
    [compilableExpressionTypes.local]: localExpression,
    [compilableExpressionTypes.conditional]: conditionalExpression,
    [compilableExpressionTypes.exceptionContext]: exceptionContextExpression,
    [compilableExpressionTypes.patternMatching]: patternMatchingExpression,
    [compilableExpressionTypes.thread]: threadExpression,
    [compilableExpressionTypes.nameCreation]: nameCreationExpression,
    [compilableExpressionTypes.cellCreation]: cellCreationExpression,
    [compilableExpressionTypes.portCreation]: portCreationExpression,
    [compilableExpressionTypes.atCell]: atCellExpression,
    [compilableExpressionTypes.colonEqualsCell]: colonEqualsCellExpression,
  },
};

export const compile = (...args) => {
  if (!args[0]) return null;
  const compiler = compilers[args[0].get("node")][args[0].get("type")];
  return compiler(compile, ...args);
};
